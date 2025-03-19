// material-ui
import { useState } from "react";

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
import useLandingSite from "hooks/useLandingSite";

const getInitialValues = () => {
	const newLandingSite = {
		name: "",
		type: "",
		capacity: "",
	};

	return newLandingSite;
};

// ==============================|| TAB - PERSONAL ||============================== //

const AddLandingSite = ({ user, onCancel }) => {
	const { createLandingSite } = useLandingSite();

	const scriptedRef = useScriptRef();

	const NewLandingSiteSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		type: Yup.string().max(255).required("Selecione um tipo"),
		capacity: Yup.number().min(1, "O valor tem que ser maior que 0").required("Capacidade é obrigatória"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: NewLandingSiteSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
			try {
				const payload = {
					name: values.name,
					type: values.type,
					capacity: values.capacity,
				};

				const response = await createLandingSite(payload);
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
					err.response.status === 409 ? "Aeródromo já existe!" : err.response.status === 400 ? "Erro ao cadastrar aeródromo! Confira se os dados estão corretos!" : "Erro ao cadastrar aeródromo!";
				if (scriptedRef.current) {
					setStatus({ success: false });
					setErrors({ submit: message });
					setSubmitting(false);
				}
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar aeródromo</DialogTitle>
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
											placeholder="Digite o nome do aeródromo..."
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
										<InputLabel htmlFor="email-signup">Tipo do aeródromo</InputLabel>
										<Select
											value={values.type}
											name="type"
											onChange={handleChange}
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											renderValue={values.type ? undefined : () => <Typography variant="subtitle1">Selecione um tipo</Typography>}
										>
											<MenuItem value={"H"}>Heliporto</MenuItem>
										</Select>
										{touched.type && errors.type && (
											<FormHelperText error id="helper-text-type-signup">
												{errors.type}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="capacity">Capacidade</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.capacity && errors.capacity)}
											id="capacity"
											type="number"
											value={values.capacity}
											name="capacity"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite a capacidade do aeródromo..."
											inputProps={{}}
										/>
										{touched.capacity && errors.capacity && (
											<FormHelperText error id="helper-text-capacity-signup">
												{errors.capacity}
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

export default AddLandingSite;
