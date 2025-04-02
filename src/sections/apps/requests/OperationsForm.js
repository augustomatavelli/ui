import PropTypes from "prop-types";
import { useCallback, useContext, useEffect, useState } from "react";

// material-ui
import { Box, Grid, InputLabel, Stack, TextField, Typography, Card, CardContent, Checkbox } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
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
						services: [...services, { id_service: id, name: name, amount: newAmount, unit: unit }],
					};
				}

				return {
					...prev,
					services: services.map((p) => (p.id_service === id ? { ...p, amount: newAmount, unit: unit } : p)),
				};
			});
		},
		[setRequestResume]
	);

	const handleCheckboxChange = (e) => {
		const { name } = e;
		setChecked((prev) => {
			const newChecked = { ...prev, [name]: !prev[name] };
			handleChange(e.id_service, e.name, newChecked[name] ? 1 : 0, e.unit);
			return newChecked;
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
								{loadingOperation ? (
									<Loader />
								) : (
									searchOperations.length > 0 && (
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
													<InputLabel>Adicione serviços (opcional)</InputLabel>
												</Grid>
												<Grid container spacing={3}>
													<OperationsList checked={checked} searchOperations={searchOperations} requestObject={requestResume} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
													{/* {searchOperations.map((e) => (
														<Grid item xs={12} key={e.id_service}>
															<Stack spacing={1.25} sx={{ width: "100%" }}>
																
																{e.unit === "un" ? (
																	<Grid sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1 }}>
																		<Checkbox
																			checked={checked[e.name]}
																			onChange={() => {
																				setChecked((prev) => {
																					if (prev[e.name]) {
																						const { [e.name]: removed, ...rest } = prev;
																						return rest;
																					} else {
																						return { ...prev, [e.name]: true };
																					}
																				});
																				handleChange(e.id_service, e.name, checked[e.name] ? 0 : 1, e.unit);
																			}}
																		/>
																		<Typography>{e.name}</Typography>
																	</Grid>
																) : (
																	<Grid sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "flex-start", gap: 1 }}>
																		<Checkbox
																			checked={checked[e.name] || false}
																			onClick={() =>
																				setChecked((prev) => {
																					if (prev[e.name]) {
																						const { [e.name]: removed, ...rest } = prev;
																						return rest;
																					} else {
																						return { ...prev, [e.name]: true };
																					}
																				})
																			}
																		/>
																		<InputLabel htmlFor="Número de passageiros">Deseja {e.name.toLowerCase()}?</InputLabel>
																		<TextField
																			id="amount"
																			type="number"
																			value={e.amount}
																			placeholder="Digite um valor..."
																			inputProps={{ min: 0 }}
																			disabled={!checked[e.name] || false}
																			onChange={(el) => {
																				const value = parseFloat(el.target.value);
																				if (!isNaN(value) && value > 0) {
																					handleChange(e.id_service, e.name, value, e.unit);
																				}
																			}}
																		/>
																	</Grid>
																)}
															</Stack>
														</Grid>
													))} */}
												</Grid>
											</Stack>
										</Grid>
									)
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

{
	/* <Card key={e.id_service} sx={{ minWidth: 200, marginRight: "1rem" }}>
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
															</Card> */
}
