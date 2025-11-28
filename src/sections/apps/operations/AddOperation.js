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
import useScriptRef from "hooks/useScriptRef";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import AlertInfoAttributionOperation from "./AlertInfoAttributionOperation";
import useChecklist from "hooks/useChecklists";
import ChecklistContext from "contexts/ChecklistContext";

const getInitialValues = () => {
	const newOperation = {
		name: "",
		price: "",
		unit: "",
		available_at: "A",
		selectionMode: "A",
		category: "",
		icon: "",
		id_checklist: "",
	};

	return newOperation;
};

const AddOperation = ({ onCancel }) => {
	const { createOperation, findCategories, findIcons } = useOperation();
	const { findAllActive } = useChecklist();

	const { categories, icons } = useContext(OperationsContext);
	const { activeChecklists } = useContext(ChecklistContext);

	const [available, setAvailable] = useState("A");
	const [stock, setStock] = useState("N");
	const [selectionMode, setSelectionMode] = useState("N");
	const [checklist, setChecklist] = useState("N");
	const [checklistId, setChecklistId] = useState(null);
	const [allowSchedule, setAllowSchedule] = useState("N");
	const [allowScheduleCapacity, setAllowScheduleCapacity] = useState();
	const [open, setOpen] = useState(false);

	const scriptedRef = useScriptRef();

	const units = ["L", "un"];

	const handleChangeAvailable = (event) => {
		setAvailable(event.target.value);
	};

	const handleChangeStock = (event) => {
		setStock(event.target.value);
	};

	const handleChangeSelectionMode = (event) => {
		setSelectionMode(event.target.value);
	};

	const handleChangeChecklist = (event) => {
		setChecklist(event.target.value);
	};

	const handleChangeChecklistItem = (event) => {
		const newValue = event.target.value;
		formik.setFieldValue("id_checklist", newValue);
		setChecklistId(newValue);
	};

	const handleChangeAllowSchedule = (event) => {
		setAllowSchedule(event.target.value);
		event.target.value === "N" && setAllowScheduleCapacity(undefined);
	};

	const handleChangeAllowScheduleCapacity = (event) => {
		allowSchedule === "S" && setAllowScheduleCapacity(Number(event.target.value));
	};

	const handleClose = () => {
		setOpen(false);
	};
	useEffect(() => {
		findCategories();
		findIcons();
		findAllActive();
	}, []);

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
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
			try {
				const payload = {
					name: values.name,
					price: parseFloat(values.price.replace(",", ".")).toFixed(1),
					unit: values.unit,
					available_at: available,
					inventory: stock,
					selection: selectionMode,
					id_category: Number(values.category),
					checklist: checklist,
					id_checklist: checklist === "S" ? checklistId : null,
					allow_schedule: allowSchedule,
					allow_schedule_capacity: allowScheduleCapacity,
					id_icon: Number(values.icon),
				};
				const response = await createOperation(payload);
				if (scriptedRef.current) {
					setStatus({ success: true });
					setSubmitting(false);
					dispatch(
						openSnackbar({
							open: true,
							message: response.message,
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
				}
			} catch (err) {
				setErrors({});
				console.error(err);
				const message =
					err.response.status === 409 ? "Serviço já existe!" : err.response.status === 400 ? "Erro ao cadastrar serviço! Confira se os dados estão corretos!" : "Erro ao cadastrar serviço!";
				if (scriptedRef.current) {
					setStatus({ success: false });
					setErrors({ submit: message });
					setSubmitting(false);
				}
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, values, handleChange, handleBlur } = formik;

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
												inputProps={{ "aria-label": "Without label" }}
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
												inputProps={{ "aria-label": "Without label" }}
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
											{touched.category && errors.category && (
												<FormHelperText error id="helper-text-category-signup">
													{errors.category}
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
												inputProps={{ "aria-label": "Without label" }}
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
										<RadioGroup aria-label="size" value={available} defaultValue="A" name="radio-buttons-group" onChange={handleChangeAvailable} row>
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
										<RadioGroup aria-label="size" value={stock} defaultValue="N" name="radio-buttons-group" onChange={handleChangeStock} row>
											<FormControlLabel value="S" control={<Radio />} label="Sim" />
											<FormControlLabel value="N" control={<Radio />} label="Não" />
										</RadioGroup>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Tipo de atribuição do serviço</InputLabel>
											<InfoCircleOutlined onClick={() => setOpen(true)} />
										</Grid>
										<RadioGroup aria-label="size" value={selectionMode} defaultValue="N" name="radio-buttons-group" onChange={handleChangeSelectionMode} row>
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
										<RadioGroup aria-label="size" value={checklist} defaultValue="N" name="radio-buttons-group" onChange={handleChangeChecklist} row>
											<FormControlLabel value="S" control={<Radio />} label="Sim" />
											<FormControlLabel value="N" control={<Radio />} label="Não" />
											<Select
												value={values.id_checklist}
												name="checklist"
												onChange={handleChangeChecklistItem}
												sx={{ width: "fit-content", marginTop: 1 }}
												displayEmpty
												disabled={checklist === "N"}
												inputProps={{ "aria-label": "Without label" }}
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
										</RadioGroup>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Grid display="flex" alignItems="center" gap={1}>
											<InputLabel htmlFor="unit">Necessita serviço de reserva?</InputLabel>
										</Grid>
										<Grid>
											<RadioGroup aria-label="size" value={allowSchedule} defaultValue="N" name="radio-buttons-group" onChange={handleChangeAllowSchedule} row>
												<FormControlLabel value="S" control={<Radio />} label="Sim" />
												<FormControlLabel value="N" control={<Radio />} label="Não" />
												<OutlinedInput
													id="capacity"
													type="number"
													disabled={allowSchedule === "N"}
													value={allowSchedule === "N" ? "" : allowScheduleCapacity || ""}
													name="capacity"
													onBlur={handleBlur}
													onChange={(event) => {
														handleChangeAllowScheduleCapacity(event);
													}}
													placeholder="Digite a capacidade..."
													sx={{ width: "50%" }}
													error={Boolean(touched.price && errors.price)}
												/>
											</RadioGroup>
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
