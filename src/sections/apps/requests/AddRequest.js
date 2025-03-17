import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

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
	Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";

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
import useAircraft from "hooks/useAircraft";
import InputMask from "react-input-mask";

// constant
const getInitialValues = (aircraft) => {
	const newAircraft = {
		rab: "",
		imagem: "",
	};

	if (aircraft) {
		newAircraft.rab = aircraft.fatherName;
		newAircraft.location = aircraft.address;
		return _.merge({}, newAircraft, aircraft);
	}

	return newAircraft;
};

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddRequest = ({ aircraft, handleAddRequest }) => {
	const { createAircraft, findAllAircrafts } = useAircraft();

	const theme = useTheme();

	const options = [
		{ label: "Opção 1", value: 1 },
		{ label: "Opção 2", value: 2 },
		{ label: "Opção 3", value: 3 },
		{ label: "Opção 4", value: 4 },
	];

	const AircraftSchema = Yup.object().shape({
		rab: Yup.string().max(255).required("RAB é obrigatório"),
	});
	//TODO: Previsão de pouso (data e horário estimado - UTC e local)
	//TODO: Pergunta se vai querer agendar a decolagem. Se sim, mostrar outro input de data
	//TODO: Necessidade de abastecimento? (Sim/Não). Se sim, mostrar um input de number para digitar a quantidade de litros
	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: AircraftSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			try {
				const newAircraft = {};
				const response = await createAircraft(newAircraft);
				await findAllAircrafts();
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
					setStatus({ success: true });
					setSubmitting(false);
					handleAddRequest();
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
						<DialogTitle>Solicitar pouso</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3} sx={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 2 }}>
									<Box
										sx={{
											width: "144px",
											height: "144px",
											borderRadius: "50%",
											overflow: "hidden",
											border: "2px solid #ccc",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											backgroundColor: "#f0f0f0",
										}}
									>
										<img
											src={`data:image/jpeg;base64,${values.image}`}
											alt="Helicopter"
											style={{
												width: "100%",
												height: "100%",
												objectFit: "fill",
											}}
										/>
									</Box>

									<Typography>{values.rab}</Typography>
									<Typography>Categoria {values.category}</Typography>
								</Grid>
								<Grid item xs={12} md={8}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="Local de pouso">Local de pouso</InputLabel>
												<Autocomplete
													options={options}
													getOptionLabel={(option) => option.label}
													renderInput={(params) => <TextField {...params} label="Selecione um local de pouso" />}
													isOptionEqualToValue={(option, value) => option.value === value.value}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel>Previsão de chegada</InputLabel>
												<DateTimePicker
													value={formik.values.dueDate}
													onChange={(date) => formik.setFieldValue("dueDate", date)}
													format="dd/MM/yyyy HH:mm"
													slotProps={{
														textField: {
															error: Boolean(formik.touched.dueDate && formik.errors.dueDate),
															helperText: formik.touched.dueDate && formik.errors.dueDate,
														},
													}}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="Número de passageiros">Número de passageiros</InputLabel>
												<TextField
													fullWidth
													id="amount"
													type="number"
													placeholder="Quantidade de passageiros..."
													{...getFieldProps("name")}
													error={Boolean(touched.name && errors.name)}
													helperText={touched.name && errors.name}
													inputProps={{ min: 0 }}
												/>
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
										<Button color="error" onClick={handleAddRequest}>
											Fechar
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Solicitar
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

AddRequest.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddRequest;
