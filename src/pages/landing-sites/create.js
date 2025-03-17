// material-ui
import { useState } from "react";

// material-ui
import { Button, Grid, InputLabel, Stack, FormHelperText, OutlinedInput, RadioGroup, FormControlLabel, Radio, Box } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import

import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

import useScriptRef from "hooks/useScriptRef";
import InputMask from "react-input-mask";
import MainCard from "components/MainCard";
import useLandingSite from "hooks/useLandingSite";

// ==============================|| TAB - PERSONAL ||============================== //

const CreateLandingSite = () => {
	const { createLandingSite } = useLandingSite();

	const scriptedRef = useScriptRef();

	return (
		<MainCard content={false} title="Criar local de pouso" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<Formik
				initialValues={{
					name: "",
					type: "",
					lat: "",
					lon: "",
					capacity: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					name: Yup.string().max(255).required("Nome é obrigatório"),
					capacity: Yup.number().min(1, "A capacidade deve ser pelo menos 1").required("Capacidade é obrigatória"),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting, setValues, resetForm }) => {
					try {
						const payload = {
							name: values.name,
							type: values.type,
							lat: values.lat,
							lon: values.lon,
							capacity: values.capacity,
						};
						const response = "";
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
						}
					} catch (err) {
						setErrors({});
						console.error(err);
						const message =
							err.response.status === 409
								? "Local de pouso já existe!"
								: err.response.status === 400
								? "Erro ao cadastrar local de pouso! Confira se os dados estão corretos!"
								: "Erro ao cadastrar local de pouso!";
						if (scriptedRef.current) {
							setStatus({ success: false });
							setErrors({ submit: message });
							setSubmitting(false);
						}
					}
				}}
			>
				{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
					<form noValidate onSubmit={handleSubmit}>
						<Box sx={{ p: 2.5 }}>
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
										<InputLabel htmlFor="email-signup">Tipo do local de pouso</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.email && errors.email)}
											id="email-login"
											type="email"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite o email..."
											inputProps={{}}
										/>
										{touched.email && errors.email && (
											<FormHelperText error id="helper-text-email-signup">
												{errors.email}
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
											placeholder="Digite a capacidade do local de pouso..."
											inputProps={{}}
										/>
										{touched.capacity && errors.capacity && (
											<FormHelperText error id="helper-text-capacity-signup">
												{errors.capacity}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								{errors.submit && (
									<Grid item xs={12}>
										<FormHelperText error>{errors.submit}</FormHelperText>
									</Grid>
								)}
								<Grid item xs={12}>
									<Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
										Criar
									</Button>
								</Grid>
							</Grid>
						</Box>
					</form>
				)}
			</Formik>
		</MainCard>
	);
};

export default CreateLandingSite;
