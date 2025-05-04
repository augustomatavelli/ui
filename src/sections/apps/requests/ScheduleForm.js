import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Grid, InputLabel, Stack, TextField, Autocomplete, Checkbox, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import LandingSiteContext from "contexts/LandingSiteContext";
import useLandingSite from "hooks/useLandingSite";
import RequestContext from "contexts/RequestContext";

const ScheduleForm = ({ aircraft, onValidate, takeoffCheckbox, setTakeoffCheckbox }) => {
	const { searchAllLandingSites } = useLandingSite();
	const { searchLandingSites } = useContext(LandingSiteContext);
	const { setRequestResume, requestResume } = useContext(RequestContext);

	const [selectedInterval, setSelectedInterval] = useState(null);
	const [checkAmount, setCheckAmount] = useState(false);

	const getInitialValues = (aircraft) => ({
		id_aircraft: aircraft.id_aircraft,
		id_landing_site: "",
		name_landing_site: "",
		amount: null,
		flight_time: "",
		landing_date: null,
		takeoff_date: null,
	});

	const handleToggleCheckBox = (event) => {
		setTakeoffCheckbox(event.target.checked);
		if (!event.target.checked) {
			formik.setFieldValue("takeoff_date", null);
			setSelectedInterval(null);
			setRequestResume((prev) => ({ ...prev, takeoff_date: null }));
		}
	};

	const handleToggleCheckBoxAmount = (event) => {
		setCheckAmount(event.target.checked);
		!event.target.checked && formik.setErrors({ amount: null });
		if (!event.target.checked) {
			formik.setFieldValue("amount", undefined);
		}
	};

	useEffect(() => {
		searchAllLandingSites();
	}, []);

	const RequestSchema = Yup.object().shape({
		id_aircraft: Yup.number(),
		id_landing_site: Yup.number().required(),
		name_landing_site: Yup.string().required(),
		amount: checkAmount ? Yup.number().min(1, "Número de passageiros tem que ser maior que 0").required("Número de passageiros é obrigatório") : Yup.number().optional().nullable(),
		flight_time: Yup.number().required("Tempo estimado de voo é obrigatório"),
		landing_date: Yup.date().nullable().required("Data e hora previstos é obrigatório"),
		takeoff_date: Yup.date().nullable().optional(),
	});

	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: RequestSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const newRequest = {
				id_aircraft: values.id_aircraft,
				id_landing_site: values.id_landing_site,
				name_landing_site: values.name_landing_site,
				amount: values.amount,
				flight_time: values.flight_time,
				landing_date: values.landing_date,
				takeoff_date: values.takeoff_date,
			};
			setRequestResume(newRequest);
		},
	});

	useEffect(() => {
		onValidate(formik.isValid && formik.dirty, formik.values);
	}, [formik.isValid, formik.dirty, formik.values]);

	// Monitora mudanças no landing_date e ajusta o takeoff_date
	useEffect(() => {
		const { landing_date, takeoff_date } = formik.values;

		if (landing_date && takeoff_date && takeoffCheckbox && selectedInterval !== null) {
			const previousLandingDate = dayjs(requestResume.landing_date);
			const previousTakeoffDate = dayjs(takeoff_date);
			if (previousLandingDate.isValid() && previousTakeoffDate.isValid()) {
				// Calcula a diferença em minutos entre o landing_date anterior e o takeoff_date
				const timeDifference = previousTakeoffDate.diff(previousLandingDate, "minute");

				// Aplica a mesma diferença ao novo landing_date
				const newTakeoffDate = dayjs(landing_date).add(timeDifference, "minute").toDate();

				formik.setFieldValue("takeoff_date", newTakeoffDate);
				setRequestResume((prev) => ({ ...prev, takeoff_date: newTakeoffDate }));
			}
		} else if (landing_date && takeoff_date && takeoffCheckbox && selectedInterval === null) {
			// Reseta takeoff_date se selectedInterval for null
			formik.setFieldValue("takeoff_date", null);
			setRequestResume((prev) => ({ ...prev, takeoff_date: null }));
		}
	}, [formik.values.landing_date, selectedInterval]);

	const { errors, touched, handleSubmit, getFieldProps } = formik;

	return (
		<Grid sx={{ width: "100%" }}>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" onSubmit={handleSubmit}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<InputLabel htmlFor="Helicentro">Helicentro</InputLabel>
										<Autocomplete
											options={searchLandingSites}
											getOptionLabel={(option) => option.label}
											isOptionEqualToValue={(option, value) => option.value === value.value}
											renderInput={(params) => <TextField {...params} />}
											onChange={(event, value) => {
												formik.setFieldValue("id_landing_site", value ? value.value : "");
												formik.setFieldValue("name_landing_site", value ? value.label : "");
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<InputLabel>Previsão de pouso</InputLabel>
										<DateTimePicker
											value={formik.values.landing_date}
											disablePast
											minDateTime={dayjs()}
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
								<Grid item display="flex" width="100%" gap={2} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										{/* <InputLabel htmlFor="Número de passageiros">Número de passageiros</InputLabel> */}
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
											<Checkbox style={{ padding: 0 }} checked={checkAmount} onChange={handleToggleCheckBoxAmount} />
											<InputLabel>Informar a quantidade de passageiros (opcional)</InputLabel>
										</Grid>
										<TextField
											fullWidth
											id="amount"
											type="number"
											value={Number(formik.values.amount)}
											placeholder="Quantidade de passageiros..."
											{...getFieldProps("amount")}
											disabled={!checkAmount}
											error={Boolean(touched.amount && errors.amount)}
											helperText={touched.amount && errors.amount}
											inputProps={{ min: 0 }}
										/>
									</Stack>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<InputLabel htmlFor="Tempo estimado de voo">Tempo estimado de voo (h)</InputLabel>
										<TextField
											fullWidth
											id="flight_time"
											type="number"
											value={Number(formik.values.flight_time)}
											placeholder="Qual a previsão do seu voo..."
											{...getFieldProps("flight_time")}
											error={Boolean(touched.flight_time && errors.flight_time)}
											helperText={touched.flight_time && errors.flight_time}
											inputProps={{ min: 0 }}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
											<Checkbox style={{ padding: 0 }} checked={takeoffCheckbox} onChange={handleToggleCheckBox} disabled={!formik.values.landing_date} />
											<InputLabel>Já deseja agendar a decolagem? (opcional)</InputLabel>
										</Grid>
										{takeoffCheckbox && (
											<>
												<Stack direction="row" spacing={1} mt={1}>
													{[5, 10, 15, 30, 60].map((minutes) => (
														<Button
															key={minutes}
															variant={selectedInterval === minutes ? "contained" : "outlined"}
															size="small"
															onClick={() => {
																const newInterval = selectedInterval === minutes ? null : minutes;
																setSelectedInterval(newInterval);
																const landingDate = dayjs(formik.values.landing_date);
																if (!landingDate.isValid()) return;
																if (newInterval === null) {
																	formik.setFieldValue("takeoff_date", null);
																	setRequestResume((prev) => ({ ...prev, takeoff_date: null }));
																} else {
																	const newTakeoff = landingDate.add(Math.floor(minutes), "minute").toDate();
																	formik.setFieldValue("takeoff_date", newTakeoff);
																	setRequestResume((prev) => ({ ...prev, takeoff_date: newTakeoff }));
																}
															}}
															disabled={!takeoffCheckbox || !formik.values.landing_date}
														>
															+{minutes} min
														</Button>
													))}
												</Stack>
												<DateTimePicker
													value={formik.values.takeoff_date}
													disablePast
													minDateTime={formik.values.landing_date || dayjs()}
													onChange={(date) => {
														formik.setFieldValue("takeoff_date", date);
														setRequestResume((prev) => ({ ...prev, takeoff_date: date }));
														setSelectedInterval(null);
													}}
													format="dd/MM/yyyy HH:mm"
													disabled={!takeoffCheckbox}
													slotProps={{
														textField: {
															error: Boolean(touched.takeoff_date && errors.takeoff_date),
															helperText: touched.takeoff_date && errors.takeoff_date,
														},
														field: { format: "dd/MM/yyyy HH:mm" },
													}}
												/>
											</>
										)}
									</Stack>
								</Grid>
							</Grid>
						</Grid>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</Grid>
	);
};

ScheduleForm.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
	takeoffCheckbox: PropTypes.bool,
	setTakeoffCheckbox: PropTypes.func,
};

export default ScheduleForm;
