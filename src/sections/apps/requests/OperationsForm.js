import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
import { Box, Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField, Typography, Autocomplete, Card, CardContent, IconButton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";
import OperationsContext from "contexts/OperationContext";
import useOperation from "hooks/useOperation";
// constant
const getInitialValues = () => {
	const newRequest = {};

	return newRequest;
};

const OperationsForm = ({ onValidate }) => {
	const { searchAllOperations } = useOperation();

	const { requestResume, setRequestResume } = useContext(RequestContext);

	const { searchOperations } = useContext(OperationsContext);
	console.log(searchOperations);

	const handleChangeAmount = (id, name, newAmount) => {
		console.log(id, name, newAmount);
		setRequestResume((prev) => {
			const operations = prev.operations || [];
			const existingProduct = operations.find((p) => p.id_service === id);
			if (!existingProduct) {
				return {
					...prev,
					operations: [...operations, { id_service: id, name: name, amount: newAmount }],
				};
			}
			return {
				...prev,
				operations: operations.map((p) => (p.id_service === id ? { ...p, amount: newAmount } : p)),
			};
		});
	};

	const formik = useFormik({
		initialValues: getInitialValues(),
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			const {} = values;
		},
	});

	useEffect(() => {
		onValidate(true, values);
	}, [formik.isValid, formik.dirty, formik.values]);

	console.log(requestResume);
	useEffect(() => {
		searchAllOperations();
	}, []);

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								{searchOperations.length > 0 && (
									<Grid item xs={12}>
										<Stack spacing={1.25}>
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
												<InputLabel>Se desejar, pode adicionar serviços</InputLabel>
											</Grid>
											<Grid container spacing={3}>
												<Stack
													direction="row"
													spacing={2}
													sx={{
														overflowX: "auto",
														p: 1,
														whiteSpace: "nowrap",
														maxWidth: "100%",
													}}
												>
													{searchOperations.map((e) => (
														<Card key={e.id_service} sx={{ minWidth: 150 }}>
															<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
																<Typography variant="subtitle1">{e.name}</Typography>
																<TextField
																	type="number"
																	value={requestResume.operations && requestResume.operations.length > 0 ? requestResume.operations.find((p) => p.id_service === e.id_service)?.amount || "" : ""}
																	onChange={(el) => handleChangeAmount(e.id_service, e.name, Number(el.target.value))}
																	inputProps={{ min: 0 }}
																	size="small"
																	sx={{ width: 80, mt: 1 }}
																/>
															</CardContent>
														</Card>
													))}
												</Stack>
											</Grid>
										</Stack>
									</Grid>
								)}
							</Grid>
						</Grid>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

OperationsForm.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
};

export default OperationsForm;
