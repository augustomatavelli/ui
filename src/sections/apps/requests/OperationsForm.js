import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Grid, InputLabel, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";
import OperationsContext from "contexts/OperationContext";
import useOperation from "hooks/useOperation";
import Loader from "components/Loader";
import { OperationsList } from "./OperationsList";

const OperationsForm = ({ onValidate }) => {
	const { searchAllOperations } = useOperation();

	const { requestResume, setRequestResume } = useContext(RequestContext);
	const { searchOperations, loadingOperation } = useContext(OperationsContext);
	const [checked, setChecked] = useState({});

	const handleChange = useCallback(
		(id, name, newAmount, unit) => {
			setRequestResume((prev) => {
				const services = prev.services || [];
				if (newAmount === 0) {
					return {
						...prev,
						services: services.filter((p) => p.id_service !== id),
					};
				}
				const existingService = services.find((p) => p.id_service === id);
				if (!existingService) {
					return {
						...prev,
						services: [...services, { id_service: id, name: name, amount: String(newAmount), unit: unit }],
					};
				}

				return {
					...prev,
					services: services.map((p) => (p.id_service === id ? { ...p, amount: String(newAmount), unit: unit } : p)),
				};
			});
		},
		[setRequestResume]
	);

	const handleCheckboxChange = (e) => {
		const { name, amount, unit } = e;
		setChecked((prev) => {
			const newChecked = { ...prev, [name]: !prev[name] };
			handleChange(e.id_service, e.name, unit === "un" ? 1 : amount, e.unit);
			return newChecked;
		});
	};

	const formik = useFormik({});

	useEffect(() => {
		onValidate(true, values);
	}, [formik.isValid, formik.dirty, formik.values]);

	useEffect(() => {
		searchAllOperations();
	}, []);

	const { handleSubmit, values } = formik;
	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								{loadingOperation ? (
									<Loader />
								) : searchOperations.length > 0 ? (
									<Grid item xs={12}>
										<Stack spacing={1.25}>
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
												<InputLabel>Adicione serviços (opcional)</InputLabel>
											</Grid>
											<Grid>
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
													<OperationsList checked={checked} searchOperations={searchOperations} requestObject={requestResume} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
												</Box>
											</Grid>
										</Stack>
									</Grid>
								) : (
									<Grid item xs={12}>
										<Box sx={{ textAlign: "center" }}>
											<Typography variant="h5">Nenhum serviço disponível</Typography>
										</Box>
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
