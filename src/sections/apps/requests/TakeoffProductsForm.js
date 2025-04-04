import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

// material-ui
import { Grid, InputLabel, Stack, Checkbox, Card, CardContent, Typography, TextField, IconButton, Box, CircularProgress, Skeleton } from "@mui/material";
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
								{searchProducts.length > 0 && (
									<Grid item xs={12}>
										<Stack spacing={1.25}>
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 }}>
												<InputLabel>Adicione produtos (opcional)</InputLabel>
											</Grid>
											{loadingProduct ? (
												Array.from({ length: 5 }).map((_, index) => (
													<Grid key={index} sx={{ display: "flex" }}>
														<Skeleton variant="rectangular" width={200} height={50} />
													</Grid>
												))
											) : (
												<ProductsList
													searchProducts={searchProducts}
													requestObject={requestResume}
													handleAddProduct={handleAddProduct}
													handleChangeProductAmount={handleChangeAmount}
													handleRemoveProduct={handleRemoveProduct}
												/>
											)}
										</Stack>
									</Grid>
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
