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
import useLandingSite from "hooks/useLandingSite";
import LandingSiteContext from "contexts/LandingSiteContext";

const getInitialValues = () => {
	const newLandingSite = {
		name: "",
		type: "",
		address: "",
		number: "",
		city: "",
		uf: "",
		capacity: "",
	};

	return newLandingSite;
};

// ==============================|| TAB - PERSONAL ||============================== //

const AddLandingSite = ({ onCancel }) => {
	const { createLandingSite, findUf } = useLandingSite();

	const { uf } = useContext(LandingSiteContext);

	const scriptedRef = useScriptRef();

	useEffect(() => {
		findUf();
	}, []);

	const NewLandingSiteSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		type: Yup.string().max(255).required("Selecione um tipo"),
		operationType: Yup.string().max(255).required("Tipo da operação é obrigatória"),
		ciad: Yup.string().max(255).required("CIAD é obrigatório"),
		address: Yup.string().max(255).required("Endereço é obrigatório"),
		number: Yup.string().optional(),
		city: Yup.string().max(255).required("Cidade é obrigatória"),
		uf: Yup.string().max(255).required("Selecione um estado"),
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
					operationType: values.operationType,
					ciad: values.ciad,
					capacity: values.capacity,
					address: values.address,
					number: values.number,
					city: values.city,
					uf: values.uf,
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

	const { errors, touched, handleSubmit, isSubmitting, values, handleChange, handleBlur } = formik;

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
										<InputLabel htmlFor="ciad">CIAD</InputLabel>
										<OutlinedInput
											id="ciad"
											type="text"
											value={values.ciad}
											name="ciad"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite o nome..."
											fullWidth
											error={Boolean(touched.ciad && errors.ciad)}
										/>
										{touched.ciad && errors.ciad && (
											<FormHelperText error id="helper-text-ciad-signup">
												{errors.ciad}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12} display="flex" width="100%" alignItems="center" gap={2}>
									<Grid item xs={8}>
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
									<Grid item xs={8}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-signup">Tipo de operação</InputLabel>
											<Select
												value={values.operationType}
												name="operationType"
												onChange={handleChange}
												displayEmpty
												inputProps={{ "aria-label": "Without label" }}
												renderValue={values.operationType ? undefined : () => <Typography variant="subtitle1">Selecione um tipo</Typography>}
											>
												<MenuItem value={"P"}>Público</MenuItem>
												<MenuItem value={"R"}>Privado</MenuItem>
											</Select>
											{touched.operationType && errors.operationType && (
												<FormHelperText error id="helper-text-operationType-signup">
													{errors.operationType}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={4}>
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
												placeholder="Digite a capacidade..."
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
								<Grid item xs={12} display="flex" width="100%" alignItems="center" gap={2}>
									<Grid item xs={8}>
										<Stack spacing={1}>
											<InputLabel htmlFor="address">Endereço</InputLabel>
											<OutlinedInput
												fullWidth
												error={Boolean(touched.address && errors.address)}
												id="address"
												type="text"
												value={values.address}
												name="address"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite o endereço..."
												inputProps={{}}
											/>
											{touched.address && errors.address && (
												<FormHelperText error id="helper-text-address-signup">
													{errors.address}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={4}>
										<Stack spacing={1}>
											<InputLabel htmlFor="number">Número</InputLabel>
											<OutlinedInput
												fullWidth
												error={Boolean(touched.number && errors.number)}
												id="number"
												type="text"
												value={values.number}
												name="number"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite o número..."
												inputProps={{}}
											/>
											{touched.number && errors.number && (
												<FormHelperText error id="helper-text-number-signup">
													{errors.number}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
								</Grid>
								<Grid item xs={12} display="flex" width="100%" alignItems="center" gap={2}>
									<Grid item xs={8}>
										<Stack spacing={1}>
											<InputLabel htmlFor="city">Cidade</InputLabel>
											<OutlinedInput
												fullWidth
												error={Boolean(touched.city && errors.city)}
												id="city"
												type="text"
												value={values.city}
												name="city"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite a cidade..."
												inputProps={{}}
											/>
											{touched.city && errors.city && (
												<FormHelperText error id="helper-text-city-signup">
													{errors.city}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
									<Grid item xs={4}>
										<Stack spacing={1}>
											<InputLabel htmlFor="uf">Estado</InputLabel>
											<Select
												value={values.uf}
												name="uf"
												onChange={handleChange}
												displayEmpty
												inputProps={{ "aria-label": "Without label" }}
												renderValue={values.uf ? undefined : () => <Typography variant="subtitle1">Selecione um estado</Typography>}
											>
												{uf.map((e) => {
													return <MenuItem value={e.uf}>{e.uf}</MenuItem>;
												})}
											</Select>
											{touched.uf && errors.uf && (
												<FormHelperText error id="helper-text-uf-signup">
													{errors.uf}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
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
