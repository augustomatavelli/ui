import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
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
	Autocomplete,
	Checkbox,
	useTheme,
	Avatar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
/* import AlertCustomerDelete from "./AlertCustomerDelete"; */

import { ThemeMode } from "config";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

// assets
import { CameraOutlined } from "@ant-design/icons";
import useAircraft from "hooks/useAircraft";
import InputMask from "react-input-mask";
import UserContext from "contexts/UserContext";

const getInitialValues = (aircraft) => {
	const newAircraft = {
		registration: "",
		category: "",
		name: "",
		doc: "",
		email: "",
		phone: "",
		membership: "",
		image: "",
	};

	if (aircraft) {
		newAircraft.registration = aircraft.fatherName;
		newAircraft.location = aircraft.address;
		return _.merge({}, newAircraft, aircraft);
	}

	return newAircraft;
};

const allStatus = ["A", "B", "C", "D", "E"];

const AddAircraft = ({ aircraft, onCancel }) => {
	//TODO: Utilizar a requisição de pesquisa de aeronaves para preencher o select de categoria
	const { createAircraft, searchAllAircrafts, findAllAircrafts, anacSearch } = useAircraft();

	const { usersResp, user, anacResponse } = useContext(UserContext);

	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();
	const [typeDoc, setTypeDoc] = useState("cpf");
	const [toggleCheckbox, setToggleCheckbox] = useState(false);
	const [showUserResp, setShowUserResp] = useState(false);
	const [selectedUserResp, setSelectedUserResp] = useState(false);

	const theme = useTheme();

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	useEffect(() => {
		if (selectedImage) {
			setAvatar(URL.createObjectURL(selectedImage));
		}
	}, [selectedImage]);

	const AircraftSchema = Yup.object().shape({
		registration: Yup.string().max(255).required("Matrícula é obrigatória"),
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
		membership: Yup.number().required("Selecione se a aeronave é mensalista"),
	});

	const AircraftNewUserSchema = Yup.object().shape({
		registration: Yup.string().max(255).required("Matrícula é obrigatória"),
		category: Yup.string().required("Categoria é obrigatório"),
		name: Yup.string(),
		doc: Yup.string(),
		email: Yup.string(),
		phone: Yup.string(),
		membership: Yup.number().required("Selecione se a aeronave é mensalista"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: selectedUserResp ? AircraftNewUserSchema : AircraftSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, errors }) => {
			try {
				const { registration, category, membership, name, email, doc, phone } = values;

				let base64Image = "";
				base64Image = await readFile(selectedImage);
				const newAircraft = {
					registration: registration,
					category: category,
					image: selectedImage ? base64Image : "",
					membership: membership,
					name: name,
					email: email,
					phone: phone,
					cpf: typeDoc === "cpf" ? doc.replace(/\D/g, "") : "",
					cnpj: typeDoc === "cnpj" ? doc.replace(/\D/g, "") : "",
					isNewUserResp: showUserResp,
				};
				console.log(newAircraft);
				const response = await createAircraft(newAircraft);
				if (response) {
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
					user.type === "A" ? await findAllAircrafts("", 1) : await searchAllAircrafts("", 1);
					setStatus({ success: true });
					setSubmitting(false);
					onCancel();
				}
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
						<DialogTitle>Criar Aeronave</DialogTitle>
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
											<Avatar alt="Avatar 1" src={avatar} sx={{ width: 144, height: 144, border: "1px dashed" }}>
												{!avatar && (
													<Stack spacing={0.5} alignItems="center">
														<CameraOutlined style={{ color: theme.palette.secondary.light, fontSize: "2rem" }} />
														<Typography sx={{ color: "secondary.lighter" }}>Carregar foto</Typography>
													</Stack>
												)}
											</Avatar>
											<Box
												sx={{
													position: "absolute",
													top: 0,
													left: 0,
													backgroundColor: "rgba(0,0,0,.25)",
													width: "100%",
													height: "100%",
													opacity: 0,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											/>
										</FormLabel>
										<TextField
											type="file"
											id="change-avtar"
											placeholder="Outlined"
											variant="outlined"
											sx={{ display: "none" }}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													const validFormats = ["image/png", "image/jpeg"];
													const maxSize = 2 * 1024 * 1024; // 2MB

													if (!validFormats.includes(file.type)) {
														dispatch(
															openSnackbar({
																open: true,
																message: "Formato inválido! Apenas PNG e JPEG são permitidos",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															})
														);
														return;
													}

													if (file.size > maxSize) {
														dispatch(
															openSnackbar({
																open: true,
																message: "O tamanho máximo permitido é 2MB",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															})
														);
														return;
													}

													setSelectedImage(file);
												}
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12} md={8}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="registration">Matrícula</InputLabel>
												<TextField
													fullWidth
													id="registration"
													placeholder="Digite a matrícula"
													{...getFieldProps("registration")}
													error={Boolean(touched.registration && errors.registration)}
													helperText={touched.registration && errors.registration}
												/>
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
											<FormControlLabel
												control={
													<Checkbox
														checked={toggleCheckbox}
														onChange={() => {
															setToggleCheckbox(!toggleCheckbox);
															setShowUserResp(true);
															setFieldValue("name", "");
															setFieldValue("email", "");
															setFieldValue("phone", "");
															setFieldValue("doc", "");
														}}
													/>
												}
												label="Cadastrar novo responsável"
												style={{ display: "flex", alignItems: "center", gap: 2 }}
											/>
										</Grid>
										{!toggleCheckbox && !selectedUserResp && (
											<Grid item xs={12}>
												<Stack spacing={1.25}>
													<InputLabel htmlFor="responsible">Responsável</InputLabel>
													<Autocomplete
														options={usersResp}
														getOptionLabel={(option) => option.name}
														onChange={(event, selectedUser) => {
															if (selectedUser) {
																setFieldValue("name", selectedUser.name);
																setFieldValue("email", selectedUser.email);
																setFieldValue("phone", selectedUser.mobile);
																setFieldValue("doc", selectedUser.cpf ? selectedUser.cpf : selectedUser.cnpj);
																selectedUser.cpf ? setTypeDoc("cpf") : setTypeDoc("cnpj");
																setShowUserResp(false);
																setSelectedUserResp(true);
																setToggleCheckbox(false);
															}
														}}
														renderInput={(params) => <TextField {...params} placeholder="Selecione um responsável" variant="outlined" />}
													/>
												</Stack>
											</Grid>
										)}
										{(selectedUserResp || (!selectedUserResp && toggleCheckbox)) && (
											<>
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
															disabled={!toggleCheckbox}
														/>
													</Stack>
												</Grid>
												<Grid item xs={12}>
													<Stack spacing={1}>
														<InputLabel htmlFor="doc-signup">Documento do responsável</InputLabel>
														<RadioGroup row value={typeDoc} onChange={(e) => setTypeDoc(e.target.value)}>
															<FormControlLabel value="cpf" control={<Radio disabled={!toggleCheckbox} />} label="CPF" />
															<FormControlLabel value="cnpj" control={<Radio disabled={!toggleCheckbox} />} label="CNPJ" />
														</RadioGroup>
														<InputMask mask={typeDoc === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"} value={values.doc} onChange={handleChange} onBlur={handleBlur} disabled={!toggleCheckbox}>
															{() => (
																<OutlinedInput
																	fullWidth
																	error={Boolean(touched.doc && errors.doc)}
																	id="doc-signup"
																	name="doc"
																	placeholder="Digite o número do documento"
																	sx={{
																		"& .MuiInputBase-input": {
																			color: !toggleCheckbox ? "rgba(191, 191, 191, 1)" : "inherit",
																		},
																	}}
																/>
															)}
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
															disabled={!toggleCheckbox}
														/>
													</Stack>
												</Grid>
												<Grid item xs={12}>
													<Stack spacing={1}>
														<InputLabel htmlFor="phone-signup">Celular</InputLabel>
														{!toggleCheckbox ? (
															<TextField fullWidth id="phone-signup" {...getFieldProps("phone")} disabled={!toggleCheckbox} />
														) : (
															<>
																<InputMask mask={"(99) 99999-9999"} value={values.phone} onChange={handleChange} onBlur={handleBlur} disabled={!toggleCheckbox}>
																	{() => (
																		<OutlinedInput
																			fullWidth
																			error={Boolean(touched.phone && errors.phone)}
																			id="phone-signup"
																			name="phone"
																			placeholder="Digite o número do celular do responsável"
																			sx={{
																				"& .MuiInputBase-input": {
																					color: !toggleCheckbox ? "rgba(191, 191, 191, 1)" : "inherit",
																				},
																			}}
																		/>
																	)}
																</InputMask>
																{touched.phone && errors.phone && (
																	<FormHelperText error id="helper-text-phone-signup">
																		{errors.phone}
																	</FormHelperText>
																)}
															</>
														)}
													</Stack>
												</Grid>
											</>
										)}
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="membership">Aeronave é mensalista?</InputLabel>
												<RadioGroup row name="membership" value={formik.values.membership} onChange={(e) => formik.setFieldValue("membership", Number(e.target.value))}>
													<FormControlLabel value={1} control={<Radio />} label="Sim" />
													<FormControlLabel value={0} control={<Radio />} label="Não" />
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
											Fechar
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
		</>
	);
};

AddAircraft.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddAircraft;
