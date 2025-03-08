import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormLabel,
	Grid,
	FormHelperText,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	TextField,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
/* import AlertCustomerDelete from "./AlertCustomerDelete"; */
import Avatar from "components/@extended/Avatar";

import { ThemeMode } from "config";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

// assets
import { CameraOutlined } from "@ant-design/icons";
import useHelicopter from "hooks/useHelicopter";
import InputMask from "react-input-mask";

// constant
const getInitialValues = (helicopter) => {
	const newHelicopter = {
		rab: "",
		category: "",
		name: "",
		doc: "",
		email: "",
		phone: "",
		membership: "",
		image: "",
	};

	if (helicopter) {
		newHelicopter.rab = helicopter.fatherName;
		newHelicopter.location = helicopter.address;
		return _.merge({}, newHelicopter, helicopter);
	}

	return newHelicopter;
};

const allStatus = ["A", "B", "C", "D", "E"];

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddHelicopter = ({ helicopter, onCancel }) => {
	const { createHelicopter } = useHelicopter();

	const [openAlert, setOpenAlert] = useState(false);
	const [isMembership, setIsMembership] = useState(true);
	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();
	const [typeDoc, setTypeDoc] = useState("cpf");

	useEffect(() => {
		if (selectedImage) {
			setAvatar(URL.createObjectURL(selectedImage));
		}
	}, [selectedImage]);

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
		onCancel();
	};

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	const theme = useTheme();

	const HelicopterSchema = Yup.object().shape({
		rab: Yup.string().max(255).required("RAB é obrigatório"),
		category: Yup.string().required("Categoria é obrigatório"),
		name: Yup.string().max(255).required("Nome é obrigatório"),
		doc: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}(\d{3})?$/, "Número do documento inválido")
			.required("Documento é obrigatório"),
		email: Yup.string().email("Digite um email válido").max(255).required("Email é obrigatório"),
		phone: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}$/, "Número de celular inválido")
			.required("Celular é obrigatório"),
		membership: Yup.string().max(255),
	});

	const formik = useFormik({
		initialValues: getInitialValues(helicopter),
		validationSchema: HelicopterSchema,
		onSubmit: async (values, { setSubmitting, setErrors }) => {
			try {
				const { rab, category, membership, name, email, doc, phone } = values;
				let base64Image = "";
				base64Image = await readFile(selectedImage);
				const newHelicopter = {
					rab: rab,
					category: category,
					image: selectedImage ? base64Image : "",
					membership: membership,
					name: name,
					email: email,
					phone: phone,
					cpf: typeDoc === "cpf" ? doc.replace(/\D/g, "") : "",
					cnpj: typeDoc === "cnpj" ? doc.replace(/\D/g, "") : "",
				};
				await createHelicopter(newHelicopter);
				dispatch(
					openSnackbar({
						open: true,
						message: "Helicóptero criado com sucesso!",
						variant: "alert",
						alert: {
							color: "success",
						},
						close: false,
					})
				);

				setSubmitting(false);
				onCancel();
			} catch (error) {
				console.error(error);
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Adicionar Helicóptero</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
										<FormLabel
											htmlFor="change-avtar"
											sx={{
												position: "relative",
												borderRadius: "50%",
												overflow: "hidden",
												"&:hover .MuiBox-root": { opacity: 1 },
												cursor: "pointer",
											}}
										>
											<Avatar alt="Avatar 1" src={avatar} sx={{ width: 144, height: 144, border: "1px dashed" }} />
											<Box
												sx={{
													position: "absolute",
													top: 0,
													left: 0,
													backgroundColor: theme.palette.mode === ThemeMode.DARK ? "rgba(255, 255, 255, .75)" : "rgba(0,0,0,.65)",
													width: "100%",
													height: "100%",
													opacity: 0,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Stack spacing={0.5} alignItems="center">
													<CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: "2rem" }} />
													<Typography sx={{ color: "secondary.lighter" }}>Carregar foto</Typography>
												</Stack>
											</Box>
										</FormLabel>
										<TextField type="file" id="change-avtar" placeholder="Outlined" variant="outlined" sx={{ display: "none" }} onChange={(e) => setSelectedImage(e.target.files?.[0])} />
									</Stack>
								</Grid>
								<Grid item xs={12} md={8}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="rab">Registro Aeronáutico Brasileiro (RAB)</InputLabel>
												<TextField fullWidth id="rab" placeholder="Digite o RAB" {...getFieldProps("rab")} error={Boolean(touched.rab && errors.rab)} helperText={touched.rab && errors.rab} />
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="category">Categoria</InputLabel>
												<FormControl fullWidth>
													<Select
														id="column-hiding"
														displayEmpty
														{...getFieldProps("category")}
														onChange={(event) => setFieldValue("category", event.target.value)}
														input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
														renderValue={(selected) => {
															if (!selected) {
																return <Typography variant="subtitle1">Selecione a categoria da aeronave</Typography>;
															}

															return <Typography variant="subtitle2">{selected}</Typography>;
														}}
													>
														{allStatus.map((column) => (
															<MenuItem key={column} value={column}>
																<ListItemText primary={column} />
															</MenuItem>
														))}
													</Select>
												</FormControl>
												{touched.category && errors.category && (
													<FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
														{errors.category}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="name">Nome do responsável (PF ou PJ)</InputLabel>
												<TextField
													fullWidth
													id="name"
													placeholder="Digite o nome do responsável"
													{...getFieldProps("name")}
													error={Boolean(touched.name && errors.name)}
													helperText={touched.name && errors.name}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="doc-signup">Documento do responsável</InputLabel>
												<RadioGroup row value={typeDoc} onChange={(e) => setTypeDoc(e.target.value)}>
													<FormControlLabel value="cpf" control={<Radio />} label="CPF" />
													<FormControlLabel value="cnpj" control={<Radio />} label="CNPJ" />
												</RadioGroup>
												<InputMask mask={typeDoc === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"} value={values.doc} onChange={handleChange} onBlur={handleBlur}>
													{() => <OutlinedInput fullWidth error={Boolean(touched.doc && errors.doc)} id="doc-signup" name="doc" placeholder="Digite o número do documento" />}
												</InputMask>
												{touched.doc && errors.doc && (
													<FormHelperText error id="helper-text-doc-signup">
														{errors.doc}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="email">Email do responsável</InputLabel>
												<TextField
													fullWidth
													id="email"
													placeholder="Digite o email do responsável"
													{...getFieldProps("email")}
													error={Boolean(touched.email && errors.email)}
													helperText={touched.email && errors.email}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="phone-signup">Celular</InputLabel>
												<InputMask mask={"(99) 99999-9999"} value={values.phone} onChange={handleChange} onBlur={handleBlur}>
													{() => <OutlinedInput fullWidth error={Boolean(touched.phone && errors.phone)} id="phone-signup" name="phone" placeholder="Digite o número do celular" />}
												</InputMask>
												{touched.phone && errors.phone && (
													<FormHelperText error id="helper-text-phone-signup">
														{errors.phone}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="membership">Helicóptero é mensalista?</InputLabel>
												<RadioGroup row value={isMembership} onChange={(e) => setIsMembership(e.target.value === "true")}>
													<FormControlLabel value={true} control={<Radio />} label="Sim" />
													<FormControlLabel value={false} control={<Radio />} label="Não" />
												</RadioGroup>
												{touched.membership && errors.membership && (
													<FormHelperText error id="membership">
														{errors.membership}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</DialogContent>
						<Divider />
						<DialogActions sx={{ p: 2.5 }}>
							<Grid container justifyContent="flex-end" alignItems="center">
								<Grid item>
									<Stack direction="row" spacing={2} alignItems="center">
										<Button color="error" onClick={onCancel}>
											Cancel
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Adicionar
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</DialogActions>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
			{/* {!isCreating && <AlertCustomerDelete title={customer.fatherName} open={openAlert} handleClose={handleAlertClose} />} */}
		</>
	);
};

AddHelicopter.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddHelicopter;
