// material-ui
import { useContext, useEffect, useState } from "react";

// material-ui
import { Button, Grid, InputLabel, Stack, FormHelperText, OutlinedInput, DialogActions, Divider, DialogTitle, DialogContent, Select, MenuItem, Typography } from "@mui/material";

// third party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project import

import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

import useScriptRef from "hooks/useScriptRef";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";

const getInitialValues = () => {
	const newOperation = {
		name: "",
		price: "",
		unit: "",
		category: "",
	};

	return newOperation;
};

// ==============================|| TAB - PERSONAL ||============================== //

const AddOperation = ({ onCancel }) => {
	const { createOperation, findCategories } = useOperation();

	const { categories } = useContext(OperationsContext);

	const scriptedRef = useScriptRef();

	const units = ["L", "un"];

	useEffect(() => {
		findCategories();
	}, []);

	const NewOperationSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		price: Yup.string().max(255).required("Preço	 é obrigatório"),
		unit: Yup.string().max(255).required("Unidade é obrigatória"),
		category: Yup.string().max(255).required("Categoria é obrigatória"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: NewOperationSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
			try {
				const payload = {
					name: values.name,
					price: parseFloat(values.price.replace(",", ".")).toFixed(1),
					unit: values.unit,
					id_category: Number(values.category),
				};
				const response = await createOperation(payload);
				if (scriptedRef.current) {
					setStatus({ success: true });
					setSubmitting(false);
					dispatch(
						openSnackbar({
							open: true,
							message: response.message,
							variant: "alert",
							alert: {
								color: "success",
							},
							close: false,
						})
					);
					setTimeout(() => {
						resetForm();
					}, 500);
					onCancel();
				}
			} catch (err) {
				setErrors({});
				console.error(err);
				const message =
					err.response.status === 409 ? "Serviço já existe!" : err.response.status === 400 ? "Erro ao cadastrar serviço! Confira se os dados estão corretos!" : "Erro ao cadastrar serviço!";
				if (scriptedRef.current) {
					setStatus({ success: false });
					setErrors({ submit: message });
					setSubmitting(false);
				}
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar serviço</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="firstname-signup">Nome</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite o nome..."
											fullWidth
											error={Boolean(touched.name && errors.name)}
										/>
										{touched.name && errors.name && (
											<FormHelperText error id="helper-text-name-signup">
												{errors.name}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="category">Categoria</InputLabel>
										<Select
											value={values.category}
											name="category"
											onChange={handleChange}
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											renderValue={values.category ? undefined : () => <Typography variant="subtitle1">Selecione uma categoria</Typography>}
										>
											{categories.map((e) => {
												return <MenuItem value={e.id_category}>{e.name}</MenuItem>;
											})}
										</Select>
										{touched.category && errors.category && (
											<FormHelperText error id="helper-text-category-signup">
												{errors.category}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="price">Preço</InputLabel>
										<OutlinedInput
											id="price"
											type="text"
											value={values.price}
											name="price"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite o preço..."
											fullWidth
											error={Boolean(touched.price && errors.price)}
										/>
										{touched.price && errors.price && (
											<FormHelperText error id="helper-text-price-signup">
												{errors.price}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="unit">Unidade de medida</InputLabel>
										<Select
											value={values.unit}
											name="unit"
											onChange={handleChange}
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											renderValue={values.unit ? undefined : () => <Typography variant="subtitle1">Selecione uma unidade de medida</Typography>}
										>
											{units.map((e) => {
												return <MenuItem value={e}>{e}</MenuItem>;
											})}
										</Select>
										{touched.unit && errors.unit && (
											<FormHelperText error id="helper-text-unit-signup">
												{errors.unit}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
							</Grid>
						</DialogContent>
						{errors.submit && (
							<Grid item xs={12}>
								<FormHelperText error>{errors.submit}</FormHelperText>
							</Grid>
						)}
						<Divider />
						<DialogActions sx={{ p: 2.5 }}>
							<Grid container justifyContent="flex-end" alignItems="center">
								<Grid item>
									<Stack direction="row" spacing={2} alignItems="center">
										<Button color="error" onClick={onCancel}>
											Fechar
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Criar
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</DialogActions>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

export default AddOperation;
