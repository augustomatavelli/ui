import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
import { Grid, InputLabel, Stack, TextField, Autocomplete, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// assets
import LandingSiteContext from "contexts/LandingSiteContext";
import useLandingSite from "hooks/useLandingSite";
import RequestContext from "contexts/RequestContext";

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
	const { searchAllLandingSites } = useLandingSite();

	const { searchLandingSites } = useContext(LandingSiteContext);
	const { setRequestResume } = useContext(RequestContext);

	const [takeoffCheckbox, setTakeoffCheckbox] = useState(false);

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

	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: RequestSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const { id_aircraft, id_landing_site, amount, landing_date, takeoff_date } = values;
			const newRequest = {
				aircraftId: id_aircraft,
				landingSiteId: id_landing_site,
				amount: amount,
				landing_date: landing_date,
				takeoff_date: takeoff_date,
			};
			setRequestResume(newRequest);
		},
	});

	useEffect(() => {
		onValidate(formik.isValid && formik.dirty, formik.values);
	}, [formik.isValid, formik.dirty, formik.values]);

	const { errors, touched, handleSubmit, getFieldProps } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit} fullWidth>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="Aeródromo">Aeródromo</InputLabel>
										<Autocomplete
											options={searchLandingSites}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) => option.value === value.value}
											renderInput={(params) => <TextField {...params} />}
											onChange={(event, value) => formik.setFieldValue("id_landing_site", value ? value.value : "")}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<InputLabel>Previsão de pouso</InputLabel>
										<DateTimePicker
											value={formik.values.landing_date}
											onChange={(date) => formik.setFieldValue("landing_date", date)}
											slotProps={{
												textField: {
													error: Boolean(touched.landing_date && errors.landing_date),
													helperText: touched.landing_date && errors.landing_date,
												},
												field: { format: "dd/MM/yyyy HH:mm" },
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
											<Checkbox style={{ padding: 0 }} checked={takeoffCheckbox} onChange={(event) => setTakeoffCheckbox(event.target.checked)} />
											<InputLabel>Já deseja agendar a decolagem?</InputLabel>
										</Grid>

										<DateTimePicker
											value={formik.values.takeoff_date}
											onChange={(date) => formik.setFieldValue("takeoff_date", date)}
											format="dd/MM/yyyy HH:mm"
											disabled={!takeoffCheckbox}
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
	onValidate: PropTypes.func.isRequired,
};

export default ScheduleForm;
