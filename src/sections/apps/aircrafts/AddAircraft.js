import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import {
	Box,
	Button,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormLabel,
	Grid,
	FormHelperText,
	InputLabel,
	Stack,
	TextField,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
	useTheme,
	Avatar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { CameraOutlined } from "@ant-design/icons";
import useAircraft from "hooks/useAircraft";
import UserContext from "contexts/UserContext";
import AircraftContext from "contexts/AircraftContext";

const getInitialValues = (aircraft) => {
	const newAircraft = {
		registration: "",
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

const AddAircraft = ({ aircraft, onCancel }) => {
	const { createAircraft, searchAllAircrafts, findAllAircrafts } = useAircraft();

	const { user } = useContext(UserContext);
	const { loadingAircraft } = useContext(AircraftContext);

	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();

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

	const AircraftNewUserSchema = Yup.object().shape({
		registration: Yup.string().max(255).required("Matrícula é obrigatória"),
		membership: Yup.number().required("Selecione se a aeronave é mensalista"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: AircraftNewUserSchema,
		onSubmit: async (values, { setSubmitting, setStatus }) => {
			try {
				const { registration, membership } = values;

				let base64Image = "";
				if (selectedImage) {
					base64Image = await readFile(selectedImage);
				}

				const newAircraft = {
					registration: registration,
					image: selectedImage ? base64Image : "",
					membership: membership,
				};

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
					const statusParams = Object.keys({});
					const paramsStatus = new URLSearchParams();
					paramsStatus.set("status", statusParams.join(","));
					user.type === "A" || user.type === "S" ? await findAllAircrafts("", 1, paramsStatus) : await searchAllAircrafts("", 1);
					setStatus({ success: true });
					setSubmitting(false);
					onCancel();
				}
			} catch (error) {
				console.error(error);
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar Aeronave</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								{(user.type === "A" || user.type === "S") && (
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
								)}
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
										<Button color="error" onClick={onCancel} disabled={loadingAircraft}>
											Fechar
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting || loadingAircraft}>
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
