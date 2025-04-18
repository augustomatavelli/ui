import PropTypes from "prop-types";
import { useContext, useEffect } from "react";

// material-ui
import { Grid, InputLabel, Stack, Box, Skeleton } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import { useFormik, Form, FormikProvider } from "formik";
import RequestContext from "contexts/RequestContext";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import { ProductsList } from "./ProductsList";

const TakeoffProductsForm = ({ onValidate }) => {
	const { searchAllProducts } = useProduct();

	const { requestResume, setRequestResume } = useContext(RequestContext);
	const { searchProducts, loadingProduct } = useContext(ProductsContext);

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
													<ProductsList
														searchProducts={searchProducts}
														requestObject={requestResume}
														handleAddProduct={handleAddProduct}
														handleChangeProductAmount={handleChangeAmount}
														handleRemoveProduct={handleRemoveProduct}
													/>
												</Box>
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
