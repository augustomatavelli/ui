import PropTypes from "prop-types";
import { useContext, useEffect } from "react";

// material-ui
import { Box, Grid, InputLabel, Stack, TextField, Typography, Card, CardContent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";
import OperationsContext from "contexts/OperationContext";
import useOperation from "hooks/useOperation";

const OperationsForm = ({ onValidate }) => {
	const { searchAllOperations } = useOperation();

	const { requestResume, setRequestResume } = useContext(RequestContext);

	const { searchOperations } = useContext(OperationsContext);
	console.log(searchOperations);

	const handleChangeAmount = (id, name, newAmount) => {
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

	const formik = useFormik({});

	useEffect(() => {
		onValidate(true, values);
	}, [formik.isValid, formik.dirty, formik.values]);

	console.log(requestResume);
	useEffect(() => {
		searchAllOperations();
	}, []);

	const { handleSubmit, values } = formik;

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
											<Grid spacing={3}>
												<Box
													sx={{
														display: "flex",
														overflowX: "auto",
														padding: "1rem",
														whiteSpace: "nowrap",
														"&::-webkit-scrollbar": {
															height: "8px",
														},
														"&::-webkit-scrollbar-thumb": {
															backgroundColor: "#888",
														},
														"&::-webkit-scrollbar-thumb:hover": {
															backgroundColor: "#555",
														},
													}}
												>
													{searchOperations.map((e) => (
														<Card key={e.id_service} sx={{ minWidth: 200, marginRight: "1rem" }}>
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
												</Box>
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
