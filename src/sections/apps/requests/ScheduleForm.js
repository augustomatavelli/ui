import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
import { Grid, InputLabel, Stack, TextField, Autocomplete, Checkbox, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// assets
import LandingSiteContext from "contexts/LandingSiteContext";
import useLandingSite from "hooks/useLandingSite";
import RequestContext from "contexts/RequestContext";

const ScheduleForm = ({ aircraft, onValidate }) => {
	const { searchAllLandingSites } = useLandingSite();

	const { searchLandingSites } = useContext(LandingSiteContext);
	const { setRequestResume, requestResume } = useContext(RequestContext);

	const [takeoffCheckbox, setTakeoffCheckbox] = useState(false);

	// constant
	const getInitialValues = (aircraft) => {
		const newRequest = {
			id_aircraft: aircraft.id_aircraft,
			id_landing_site: "",
			name_landing_site: "",
			amount: "",
			flight_time: "",
			landing_date: "",
			takeoff_date: "",
		};

		return newRequest;
	};

	const handleToggleCheckBox = (event) => {
		setTakeoffCheckbox(event.target.checked);
		if (!event.target.checked) {
			setRequestResume((prev) => ({ ...prev, takeoff_date: "" }));
		}
	};

	useEffect(() => {
		searchAllLandingSites();
	}, []);

	const RequestSchema = Yup.object().shape({
		id_aircraft: Yup.number(),
		id_landing_site: Yup.number().required(),
		name_landing_site: Yup.string().required(),
		amount: Yup.number().min(1, "Número de passageiros tem que ser maior que 0").required("Número de passageiros é obrigatório"),
		flight_time: Yup.number().optional(),
		landing_date: Yup.date().required("Data e hora previstos é obrigatório"),
	});
	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: RequestSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const { id_aircraft, id_landing_site, name_landing_site, amount, flight_time, landing_date, takeoff_date } = values;
			const newRequest = {
				id_aircraft: id_aircraft,
				id_landing_site: id_landing_site,
				name_landing_site: name_landing_site,
				amount: amount,
				flight_time: flight_time,
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
		<Grid sx={{ width: "100%" }}>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" onSubmit={handleSubmit}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<InputLabel htmlFor="Aeródromo">Aeródromo</InputLabel>
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
										<InputLabel htmlFor="Número de passageiros">Número de passageiros</InputLabel>
										<TextField
											fullWidth
											id="amount"
											type="number"
											value={Number(formik.values.amount)}
											placeholder="Quantidade de passageiros..."
											{...getFieldProps("amount")}
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
											<Checkbox style={{ padding: 0 }} checked={takeoffCheckbox} onChange={handleToggleCheckBox} disabled={formik.values.landing_date === ""} />
											<InputLabel>Já deseja agendar a decolagem? (opcional)</InputLabel>
										</Grid>
										<Stack direction="row" spacing={1} mt={1}>
											{[5, 10, 15, 30, 60].map((minutes) => (
												<Button
													key={minutes}
													variant="outlined"
													size="small"
													onClick={() => {
														const landingDate = dayjs(formik.values.landing_date);
														if (!landingDate.isValid()) return;
														const newTakeoff = landingDate.add(minutes, "minute");
														formik.setFieldValue("takeoff_date", newTakeoff);
													}}
													disabled={!takeoffCheckbox}
												>
													+{minutes} min
												</Button>
											))}
										</Stack>
										<DateTimePicker
											value={requestResume ? requestResume.takeoff_date : formik.values.takeoff_date}
											disablePast
											minDateTime={requestResume.landing_date}
											onChange={(date) => formik.setFieldValue("takeoff_date", date)}
											format="dd/MM/yyyy HH:mm"
											disabled={!takeoffCheckbox}
											slotProps={{
												textField: {
													error: Boolean(formik.touched.takeoff_date && formik.errors.takeoff_date),
													helperText: formik.touched.takeoff_date && formik.errors.takeoff_date,
												},
												field: { format: "dd/MM/yyyy HH:mm" },
											}}
										/>
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
};

export default ScheduleForm;
