import PropTypes from "prop-types";
import { useContext, useEffect } from "react";

// material-ui
import { Box, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField, Typography, Autocomplete } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";

// constant
const getInitialValues = () => {
	const newRequest = {};

	return newRequest;
};

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ProductsOperationsForm = ({ onValidate }) => {
	const { requestResume } = useContext(RequestContext);

	const RequestSchema = Yup.object().shape({});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: RequestSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const {} = values;
		},
	});

	useEffect(() => {
		console.log(requestResume);
		onValidate(true, values);
	}, [formik.isValid, formik.dirty, formik.values]);

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Grid item xs={12} md={8}>
							<Grid container spacing={3}>
								{/* <Grid item xs={12}>
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
									</Grid> */}
							</Grid>
						</Grid>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

ProductsOperationsForm.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
};

export default ProductsOperationsForm;
