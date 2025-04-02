import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
import { Grid, InputLabel, Stack, Checkbox, Card, CardContent, Typography, TextField, IconButton, Box, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";

// third-party.png
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import Loader from "components/Loader";
import { ProductsList } from "./ProductsList";

const TakeoffProductsForm = ({ onValidate }) => {
	const { searchAllProducts } = useProduct();

	const { requestResume, setRequestResume } = useContext(RequestContext);
	const { searchProducts, loadingProduct } = useContext(ProductsContext);

	const [takeoffCheckbox, setTakeoffCheckbox] = useState(requestResume.takeoff_date ? true : false);

	const handleAddProduct = (newProduct, name) => {
		setRequestResume((prev) => {
			const products = prev.products || [];
			const existingProduct = products.find((p) => p.id_product === newProduct);
			if (!existingProduct) {
				return {
					...prev,
					products: [...products, { id_product: newProduct, name: name, amount: 1 }],
				};
			}
			return {
				...prev,
				products: products.map((p) => (p.id_product === newProduct ? { ...p, amount: p.amount + 1 } : p)),
			};
		});
	};

	const handleChangeAmount = (id, newAmount) => {
		setRequestResume((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: newAmount } : p)),
		}));
	};

	const handleRemoveProduct = (id) => {
		setRequestResume((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: Math.max(0, p.amount - 1) } : p)),
		}));
	};

	const handleToggleCheckBox = (event) => {
		setTakeoffCheckbox(event.target.checked);
		if (!event.target.checked) {
			setRequestResume((prev) => ({ ...prev, takeoff_date: "" }));
		}
	};

	const formik = useFormik({});

	useEffect(() => {
		onValidate(true, values);
	}, [formik.isValid, formik.dirty, formik.values]);

	useEffect(() => {
		searchAllProducts();
	}, []);

	const { handleSubmit, values } = formik;

	return (
		<Grid sx={{ width: "100%" }}>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<Grid item xs={12}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1.25}>
										<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
											<Checkbox style={{ padding: 0 }} checked={takeoffCheckbox} onChange={handleToggleCheckBox} />
											<InputLabel>Já deseja agendar a decolagem? (opcional)</InputLabel>
										</Grid>
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
								{loadingProduct ? (
									<CircularProgress size={20} />
								) : (
									searchProducts.length > 0 && (
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
													<InputLabel>Adicione produtos (opcional)</InputLabel>
												</Grid>
												<ProductsList
													searchProducts={searchProducts}
													requestObject={requestResume}
													handleAddProduct={handleAddProduct}
													handleChangeAmount={handleChangeAmount}
													handleRemoveProduct={handleRemoveProduct}
												/>
												{/* <Box
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
														{searchProducts.map((e) => (
															<Card key={e.id_product} sx={{ minWidth: 200, marginRight: "1rem" }}>
																<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
																	<Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, maxWidth: "25%" }}>
																		<Box
																			sx={{
																				width: "100%",
																				height: "50px",
																				overflow: "hidden",
																				display: "flex",
																				alignItems: "center",
																				justifyContent: "center",
																				backgroundColor: "#f0f0f0",
																			}}
																		>
																			<img
																				src={`data:image/jpeg;base64,${e.image}`}
																				alt="Product"
																				style={{
																					width: "100%",
																					height: "100%",
																					objectFit: "fill",
																				}}
																			/>
																		</Box>
																		<Typography variant="subtitle1">{e.name}</Typography>
																	</Grid>
																	<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
																		<IconButton onClick={() => handleRemoveProduct(e.id_product, e.name)} color="error" sx={{ mt: 1, fontSize: 20 }}>
																			<MinusCircleFilled />
																		</IconButton>
																		<TextField
																			type="number"
																			value={requestResume.products && requestResume.products.length > 0 ? requestResume.products.find((p) => p.id_product === e.id_product)?.amount : 0}
																			onChange={(el) => handleChangeAmount(e.id_product, e.name, Number(el.target.value))}
																			inputProps={{ min: 0 }}
																			size="small"
																			sx={{ width: 80, mt: 1 }}
																		/>
																		<IconButton onClick={() => handleAddProduct(e.id_product, e.name)} color="success" sx={{ mt: 1, fontSize: 20 }}>
																			<PlusCircleFilled />
																		</IconButton>
																	</Grid>
																</CardContent>
															</Card>
														))}
													</Box> */}
											</Stack>
										</Grid>
									)
								)}
							</Grid>
						</Grid>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</Grid>
	);
};

TakeoffProductsForm.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
};

export default TakeoffProductsForm;
