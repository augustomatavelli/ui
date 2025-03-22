import PropTypes from "prop-types";
import { useContext, useEffect } from "react";

// material-ui
import { Grid, InputLabel, Stack, TextField, Autocomplete } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

// assets
import LandingSiteContext from "contexts/LandingSiteContext";
import useLandingSite from "hooks/useLandingSite";
import useRequest from "hooks/useRequest";

// constant
const getInitialValues = (aircraft) => {
	const newRequest = {
		id_aircraft: aircraft.id_aircraft,
		id_landing_site: "",
		amount: "",
		landing_date: "",
		takeoff_date: "",
	};

	return newRequest;
};

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ScheduleForm = ({ aircraft, onValidate }) => {
	const { createRequest } = useRequest();

	const { searchAllLandingSites } = useLandingSite();

	const { searchLandingSites } = useContext(LandingSiteContext);

	useEffect(() => {
		searchAllLandingSites();
	}, []);

	const RequestSchema = Yup.object().shape({
		id_aircraft: Yup.number(),
		id_landing_site: Yup.number(),
		amount: Yup.number().min(1, "Número de passageiros tem que ser maior que 0").required("Número de passageiros é obrigatório"),
		landing_date: Yup.date().required("Data e hora previstos é obrigatório"),
		takeoff_date: Yup.date().optional(),
	});

	//TODO: Pergunta se vai querer agendar a decolagem. Se sim, mostrar outro input de data
	//TODO: Necessidade de abastecimento? (Sim/Não). Se sim, mostrar um input de number para digitar a quantidade de litros
	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: RequestSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const { id_aircraft, id_landing_site, amount, landing_date, takeoff_date } = values;
			try {
				const newRequest = {
					aircraftId: id_aircraft,
					landingSiteId: id_landing_site,
					amount: amount,
					landing_date: landing_date,
					takeoff_date: takeoff_date,
				};
				const response = await createRequest(newRequest);
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
				}
			} catch (error) {
				console.error(error);
			}
		},
	});

	useEffect(() => {
		onValidate(formik.isValid && formik.dirty);
	}, [formik.isValid, formik.dirty]);

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Grid item xs={12} md={8}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="Aeródromo">Aeródromo</InputLabel>
										<Autocomplete
											options={searchLandingSites}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) => option.value === value.value}
											renderInput={(params) => <TextField {...params} />}
											onChange={(event, value) => formik.setFieldValue("id_landing_site", value.value)}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<InputLabel>Previsão de pouso</InputLabel>
										<DateTimePicker
											value={formik.values.landing_date}
											onChange={(date) => formik.setFieldValue("landing_date", date)}
											format="dd/MM/yyyy HH:mm"
											slotProps={{
												textField: {
													error: Boolean(formik.touched.landing_date && formik.errors.landing_date),
													helperText: formik.touched.landing_date && formik.errors.landing_date,
												},
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<InputLabel>Previsão de decolagem</InputLabel>
										<DateTimePicker
											value={formik.values.takeoff_date}
											onChange={(date) => formik.setFieldValue("takeoff_date", date)}
											format="dd/MM/yyyy HH:mm"
											slotProps={{
												textField: {
													error: Boolean(formik.touched.takeoff_date && formik.errors.takeoff_date),
													helperText: formik.touched.takeoff_date && formik.errors.takeoff_date,
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
											{...getFieldProps("amount")}
											error={Boolean(touched.amount && errors.amount)}
											helperText={touched.amount && errors.amount}
											inputProps={{ min: 0 }}
										/>
									</Stack>
								</Grid>
							</Grid>
						</Grid>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

ScheduleForm.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
};

export default ScheduleForm;
