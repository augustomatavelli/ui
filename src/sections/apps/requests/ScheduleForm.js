import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Grid, InputLabel, Stack, TextField, Autocomplete, Checkbox, Button, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { addMinutes, isValid as isValidDate } from "date-fns";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import LandingSiteContext from "contexts/LandingSiteContext";
import useLandingSite from "hooks/useLandingSite";
import RequestContext from "contexts/RequestContext";
import AlertLandingSiteInfo from "../customer/AlertLandingSiteInfo";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { now } from "utils/date";

// Configuração por modo: define qual data é a primária (obrigatória, picker do topo)
// e qual é a secundária (opcional, agendada via checkbox + botões de intervalo).
const MODE_CONFIG = {
	landing: {
		primaryField: "landing_date",
		secondaryField: "takeoff_date",
		primaryLabel: "Previsão de pouso",
		secondaryCheckboxLabel: "Já deseja agendar a decolagem? (opcional)",
	},
	takeoff: {
		primaryField: "takeoff_date",
		secondaryField: "landing_date",
		primaryLabel: "Previsão de decolagem",
		secondaryCheckboxLabel: "Já deseja agendar o pouso? (opcional)",
	},
};

const ScheduleForm = ({ mode, aircraft, onValidate, secondaryCheckbox, setSecondaryCheckbox }) => {
	const { primaryField, secondaryField, primaryLabel, secondaryCheckboxLabel } = MODE_CONFIG[mode];

	const { searchAllLandingSites } = useLandingSite();
	const { searchLandingSites } = useContext(LandingSiteContext);
	const { setRequestResume } = useContext(RequestContext);

	const [selectedInterval, setSelectedInterval] = useState(null);
	const [checkAmount, setCheckAmount] = useState(false);
	const [open, setOpen] = useState(false);

	const getInitialValues = (aircraft) => ({
		id_aircraft: aircraft.id_aircraft,
		id_landing_site: 1,
		name_landing_site: "Heliforte",
		amount: null,
		flight_time: "",
		landing_date: null,
		takeoff_date: null,
		html_about: null,
	});

	const handleToggleCheckBox = (event) => {
		setSecondaryCheckbox(event.target.checked);
		if (!event.target.checked) {
			formik.setFieldValue(secondaryField, null);
			setSelectedInterval(null);
			setRequestResume((prev) => ({ ...prev, [secondaryField]: null }));
		}
	};

	const handleToggleCheckBoxAmount = (event) => {
		setCheckAmount(event.target.checked);
		!event.target.checked && formik.setErrors({ amount: null });
		if (!event.target.checked) {
			formik.setFieldValue("amount", undefined);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		searchAllLandingSites();
	}, []);

	const RequestSchema = Yup.object().shape({
		id_aircraft: Yup.number(),
		amount: checkAmount ? Yup.number().min(1, "Número de passageiros tem que ser maior que 0").required("Número de passageiros é obrigatório") : Yup.number().optional().nullable(),
		flight_time: Yup.number().required("Tempo estimado de voo é obrigatório"),
		[primaryField]: Yup.date().nullable().required("Data e hora previstos é obrigatório"),
		[secondaryField]: Yup.date().nullable().optional(),
	});

	const formik = useFormik({
		initialValues: getInitialValues(aircraft),
		validationSchema: RequestSchema,
		onSubmit: async (values) => {
			const newRequest = {
				id_aircraft: values.id_aircraft,
				id_landing_site: 1,
				name_landing_site: "Heliforte",
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

	useEffect(() => {
		const primaryDate = formik.values[primaryField];

		if (primaryDate && secondaryCheckbox && selectedInterval !== null) {
			if (isValidDate(new Date(primaryDate))) {
				const newSecondary = addMinutes(new Date(primaryDate), selectedInterval);
				formik.setFieldValue(secondaryField, newSecondary);
				setRequestResume((prev) => ({ ...prev, [secondaryField]: newSecondary }));
			}
		}
	}, [selectedInterval]);

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
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
											<InputLabel htmlFor="Helicentro">Helicentro</InputLabel>
											<Button sx={{ display: "flex", alignItems: "center", justifyContent: "center", m: 0, p: 0.5, width: "fit-content" }} onClick={() => setOpen(true)}>
												<QuestionCircleOutlined />
												<Typography variant="subtitle2" sx={{ ml: 0.5 }}>
													Sobre
												</Typography>
											</Button>
										</Grid>
										<Autocomplete
											options={searchLandingSites}
											disabled
											getOptionLabel={(option) => option.label}
											value={searchLandingSites.find((option) => option.value === 1) || null}
											isOptionEqualToValue={(option, value) => option.value === value.value}
											renderInput={(params) => <TextField {...params} />}
											onChange={(event, value) => {
												formik.setFieldValue("id_landing_site", value ? value.value : "");
												formik.setFieldValue("name_landing_site", value ? value.label : "");
												formik.setFieldValue("html_about", value.html ? true : false);
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<InputLabel>{primaryLabel}</InputLabel>
										<DateTimePicker
											value={formik.values[primaryField]}
											disablePast
											minDateTime={now()}
											onChange={(date) => formik.setFieldValue(primaryField, date)}
											slotProps={{
												textField: {
													error: Boolean(touched[primaryField] && errors[primaryField]),
													helperText: touched[primaryField] && errors[primaryField],
												},
												field: { format: "dd/MM/yyyy HH:mm" },
											}}
										/>
									</Stack>
								</Grid>
								<Grid item display="flex" width="100%" gap={2} sx={{ flexDirection: { xs: "column", sm: "column", md: "row" } }}>
									<Stack spacing={1.25} sx={{ width: "100%" }}>
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
											<Checkbox style={{ padding: 0 }} checked={checkAmount} onChange={handleToggleCheckBoxAmount} />
											<InputLabel>Informar a quantidade de passageiros (opcional)</InputLabel>
										</Grid>
										<TextField
											fullWidth
											id="amount"
											type="number"
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
											<Checkbox style={{ padding: 0 }} checked={secondaryCheckbox} onChange={handleToggleCheckBox} disabled={!formik.values[primaryField]} />
											<InputLabel>{secondaryCheckboxLabel}</InputLabel>
										</Grid>
										{secondaryCheckbox && (
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
																const primaryDate = formik.values[primaryField];
																if (!primaryDate || !isValidDate(new Date(primaryDate))) return;
																if (newInterval === null) {
																	formik.setFieldValue(secondaryField, null);
																	setRequestResume((prev) => ({ ...prev, [secondaryField]: null }));
																} else {
																	const newSecondary = addMinutes(new Date(primaryDate), Math.floor(minutes));
																	formik.setFieldValue(secondaryField, newSecondary);
																	setRequestResume((prev) => ({ ...prev, [secondaryField]: newSecondary }));
																}
															}}
															disabled={!secondaryCheckbox || !formik.values[primaryField]}
														>
															+{minutes} min
														</Button>
													))}
												</Stack>
												<DateTimePicker
													value={formik.values[secondaryField]}
													disablePast
													minDateTime={formik.values[primaryField] ? new Date(formik.values[primaryField]) : now()}
													onChange={(date) => {
														formik.setFieldValue(secondaryField, date);
														setRequestResume((prev) => ({ ...prev, [secondaryField]: date }));
														setSelectedInterval(null);
													}}
													format="dd/MM/yyyy HH:mm"
													disabled={!secondaryCheckbox}
													slotProps={{
														textField: {
															error: Boolean(touched[secondaryField] && errors[secondaryField]),
															helperText: touched[secondaryField] && errors[secondaryField],
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
						<AlertLandingSiteInfo open={open} handleClose={handleClose} data={formik.values.html_about} />
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</Grid>
	);
};

ScheduleForm.propTypes = {
	mode: PropTypes.oneOf(["landing", "takeoff"]).isRequired,
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
	secondaryCheckbox: PropTypes.bool,
	setSecondaryCheckbox: PropTypes.func,
};

export default ScheduleForm;
