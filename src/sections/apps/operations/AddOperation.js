import { useContext, useEffect, useState } from "react";
import {
	Button,
	Grid,
	InputLabel,
	Stack,
	FormHelperText,
	OutlinedInput,
	DialogActions,
	Divider,
	DialogTitle,
	DialogContent,
	Select,
	MenuItem,
	Typography,
	RadioGroup,
	Radio,
	FormControlLabel,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { InfoCircleOutlined } from "@ant-design/icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import AlertInfoAttributionOperation from "./AlertInfoAttributionOperation";
import RadioYesNo from "./RadioYesNo";
import useChecklist from "hooks/useChecklists";
import ChecklistContext from "contexts/ChecklistContext";

const getInitialValues = () => {
	const newOperation = {
		name: "",
		price: "",
		unit: "",
		available_at: "A",
		category: "",
		icon: "",
		inventory: "N",
		selection: "N",
		checklist: "N",
		id_checklist: "",
		allow_schedule: "N",
		allow_schedule_capacity: "",
	};

	return newOperation;
};

const AddOperation = ({ onCancel }) => {
	const { createOperation, findCategories, findIcons } = useOperation();
	const { findAllActive } = useChecklist();

	const { categories, icons } = useContext(OperationsContext);
	const { activeChecklists } = useContext(ChecklistContext);

	const [open, setOpen] = useState(false);

	const units = ["L", "un"];

	const handleClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		findCategories();
		findIcons();
		findAllActive();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const NewOperationSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		price: Yup.string().max(255).required("Preço	 é obrigatório"),
		unit: Yup.string().max(255).required("Unidade é obrigatória"),
		category: Yup.string().max(255).required("Categoria é obrigatória"),
		icon: Yup.number().required("Ícone é obrigatório"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: NewOperationSchema,
		onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
			const payload = {
				name: values.name,
				price: parseFloat(values.price.replace(",", ".")).toFixed(1),
				unit: values.unit,
				available_at: values.available_at,
				inventory: values.inventory,
				selection: values.selection,
				id_category: Number(values.category),
				checklist: values.checklist,
				id_checklist: values.checklist === "S" ? values.id_checklist : null,
				allow_schedule: values.allow_schedule,
				allow_schedule_capacity: values.allow_schedule === "N" ? undefined : values.allow_schedule_capacity === "" ? undefined : Number(values.allow_schedule_capacity),
				id_icon: Number(values.icon),
			};

			const result = await createOperation(payload);
			if (!result) {
				setSubmitting(false);
				return;
			}

			setStatus({ success: true });
			setSubmitting(false);
			dispatch(
				openSnackbar({
					open: true,
					message: "Serviço cadastrado com sucesso!",
					variant: "alert",
					alert: {
						color: "success",
					},
					close: false,
				})
			);
			setTimeout(() => {
				resetForm();
			}, 500);
			onCancel();
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, values, handleChange, handleBlur, setFieldValue } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar serviço</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="firstname-signup">Nome</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite o nome..."
											fullWidth
											error={Boolean(touched.name && errors.name)}
										/>
										{touched.name && errors.name && (
											<FormHelperText error id="helper-text-name-signup">
												{errors.name}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12} display="flex" width="100%" alignItems="center" gap={2}>
									<Grid item xs={6}>
										<Stack spacing={1}>
											<InputLabel htmlFor="category">Categoria</InputLabel>
											<Select
												value={values.category}
												name="category"
												onChange={handleChange}
												displayEmpty
												inputProps={{ "aria-label": "Categoria" }}
												renderValue={values.category ? undefined : () => <Typography variant="subtitle1">Selecione uma categoria</Typography>}
											>
												{categories.map((e) => {
													return (
														<MenuItem key={e.id_category} value={e.id_category}>
															{e.name}
														</MenuItem>
													);
												})}
											</Select>
											{touched.category && errors.category && (
												<FormHelperText error id="helper-text-category-signup">
													{errors.category}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={1}>
											<InputLabel htmlFor="icon">Ícone</InputLabel>
											<Select
												value={values.icon}
												name="icon"
												onChange={handleChange}
												displayEmpty
												inputProps={{ "aria-label": "Ícone" }}
												renderValue={values.icon ? undefined : () => <Typography variant="subtitle1">Selecione um ícone</Typography>}
											>
												{icons.map((e) => {
													const IconComponent = Icons[e.name];
													return (
														<MenuItem key={e.id_icon} value={e.id_icon}>
															{IconComponent && <IconComponent style={{ fontSize: 30, color: "grey", alignItems: "center" }} />}
														</MenuItem>
													);
												})}
											</Select>
											{touched.icon && errors.icon && (
												<FormHelperText error id="helper-text-icon-signup">
													{errors.icon}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
								</Grid>
								<Grid item xs={12} display="flex" width="100%" alignItems="center" gap={2}>
									<Grid item xs={6}>
										<Stack spacing={1}>
											<InputLabel htmlFor="price">Preço</InputLabel>
											<OutlinedInput
												id="price"
												type="text"
												value={values.price}
												name="price"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite o preço..."
												fullWidth
												error={Boolean(touched.price && errors.price)}
											/>
											{touched.price && errors.price && (
												<FormHelperText error id="helper-text-price-signup">
													{errors.price}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={6}>
										<Stack spacing={1}>
											<InputLabel htmlFor="unit">Unidade de medida</InputLabel>
											<Select
												value={values.unit}
												name="unit"
												onChange={handleChange}
												displayEmpty
												inputProps={{ "aria-label": "Unidade de medida" }}
												renderValue={values.unit ? undefined : () => <Typography variant="subtitle1">Selecione uma unidade de medida</Typography>}
											>
												{units.map((e) => {
													return <MenuItem value={e}>{e}</MenuItem>;
												})}
											</Select>
											{touched.unit && errors.unit && (
												<FormHelperText error id="helper-text-unit-signup">
													{errors.unit}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
								</Grid>

								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="unit">Disponibilidade do serviço</InputLabel>
										<RadioGroup
											aria-label="size"
											value={values.available_at}
											defaultValue="A"
											name="radio-buttons-group"
											onChange={(event) => setFieldValue("available_at", event.target.value)}
											row
										>
											<FormControlLabel value="P" control={<Radio />} label="No pouso" />
											<FormControlLabel value="D" control={<Radio />} label="Na decolagem" />
											<FormControlLabel value="A" control={<Radio />} label="Ambos" />
										</RadioGroup>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Controle de estoque?</InputLabel>
										</Grid>
										<RadioYesNo value={values.inventory} onChange={(event) => setFieldValue("inventory", event.target.value)} />
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Tipo de atribuição do serviço</InputLabel>
											<InfoCircleOutlined onClick={() => setOpen(true)} />
										</Grid>
										<RadioGroup
											aria-label="size"
											value={values.selection}
											defaultValue="N"
											name="radio-buttons-group"
											onChange={(event) => setFieldValue("selection", event.target.value)}
											row
										>
											<FormControlLabel value="S" control={<Radio />} label="Manual" />
											<FormControlLabel value="N" control={<Radio />} label="Automático" />
										</RadioGroup>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Necessita de checklist?</InputLabel>
										</Grid>
										<RadioYesNo value={values.checklist} onChange={(event) => setFieldValue("checklist", event.target.value)}>
											<Select
												value={values.id_checklist}
												name="checklist"
												onChange={(event) => setFieldValue("id_checklist", event.target.value)}
												sx={{ width: "fit-content", marginTop: 1 }}
												displayEmpty
												disabled={values.checklist === "N"}
												inputProps={{ "aria-label": "Checklist" }}
												renderValue={values.id_checklist ? undefined : () => <Typography variant="subtitle1">Selecione um checklist</Typography>}
											>
												{activeChecklists.map((e) => {
													return (
														<MenuItem key={e.id_checklist} value={e.id_checklist}>
															{e.name}
														</MenuItem>
													);
												})}
											</Select>
											{touched.id_checklist && errors.id_checklist && (
												<FormHelperText error id="helper-text-id_checklist-signup">
													{errors.id_checklist}
												</FormHelperText>
											)}
										</RadioYesNo>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Necessita serviço de reserva?</InputLabel>
										</Grid>
										<Grid>
											<RadioYesNo
												value={values.allow_schedule}
												onChange={(event) => {
													setFieldValue("allow_schedule", event.target.value);
													event.target.value === "N" && setFieldValue("allow_schedule_capacity", "");
												}}
											>
												<OutlinedInput
													id="capacity"
													type="number"
													disabled={values.allow_schedule === "N"}
													value={values.allow_schedule === "N" ? "" : values.allow_schedule_capacity || ""}
													name="capacity"
													onBlur={handleBlur}
													onChange={(event) => {
														values.allow_schedule === "S" && setFieldValue("allow_schedule_capacity", event.target.value);
													}}
													placeholder="Digite a capacidade..."
													sx={{ width: "50%" }}
													error={Boolean(touched.allow_schedule_capacity && errors.allow_schedule_capacity)}
												/>
											</RadioYesNo>
										</Grid>
									</Stack>
								</Grid>
							</Grid>
							{open && <AlertInfoAttributionOperation open={open} handleClose={handleClose} />}
						</DialogContent>
						{errors.submit && (
							<Grid item xs={12}>
								<FormHelperText error>{errors.submit}</FormHelperText>
							</Grid>
						)}
						<Divider />
						<DialogActions sx={{ p: 2.5 }}>
							<Grid container justifyContent="flex-end" alignItems="center">
								<Grid item>
									<Stack direction="row" spacing={2} alignItems="center">
										<Button color="error" onClick={onCancel}>
											Fechar
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Criar
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</DialogActions>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

export default AddOperation;
