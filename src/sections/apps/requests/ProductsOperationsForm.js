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
import ProductsContext from "contexts/ProductsContext";

// constant
const getInitialValues = () => {
	const newRequest = {};

	return newRequest;
};

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ProductsOperationsForm = ({ onValidate }) => {
	const { requestResume, setRequestResume } = useContext(RequestContext);
	const { products } = useContext(ProductsContext);

	const [productsSelected, setProductSelected] = useState([]);

	const handleAdicionarProduto = (_, novoProduto) => {
		if (novoProduto && !productsSelected.find((p) => p.id === novoProduto.id)) {
			setProductSelected([...productsSelected, { ...novoProduto, quantidade: 1 }]);
		}
	};

	const handleAlterarQuantidade = (id, novaQuantidade) => {
		setProductSelected((prev) => prev.map((p) => (p.id === id ? { ...p, quantidade: novaQuantidade } : p)));
	};

	const handleRemoverProduto = (id) => {
		setProductSelected((prev) => prev.filter((p) => p.id !== id));
	};
	
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
						<Grid item xs={12}>
							<Grid container spacing={3}>
								{products.length > 0 && (
									<Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: "auto", p: 1 }}>
										{products.map((e) => (
											<Card key={e.id_product} sx={{ minWidth: 150 }}>
												<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
													<Typography variant="subtitle1">{e.name}</Typography>
													<TextField
														type="number"
														value={requestResume[`${e.id_product}`]}
														onChange={(e) => handleAlterarQuantidade(e.id_product, Number(e.target.value))}
														inputProps={{ min: 1 }}
														size="small"
														sx={{ width: 80, mt: 1 }}
													/>
													<IconButton onClick={() => handleRemoverProduto(encodeURIComponent.id_product)} color="error" sx={{ mt: 1 }}>
														{/* <Delete /> */}
													</IconButton>
												</CardContent>
											</Card>
										))}
									</Stack>
								)}
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
