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

import useUser from "hooks/useUser";
import useScriptRef from "hooks/useScriptRef";
import InputMask from "react-input-mask";
import MainCard from "components/MainCard";

// ==============================|| TAB - PERSONAL ||============================== //

const CreateUser = () => {
	const { createUserByAdmin } = useUser();

	const scriptedRef = useScriptRef();

	const [typeDoc, setTypeDoc] = useState("cpf");
	const [isPilot, setIsPilot] = useState(1);

	return (
		<MainCard content={false} title="Criar usuário" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<Formik
				initialValues={{
					name: "",
					email: "",
					phone: "",
					doc: "",
					pilot: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					name: Yup.string().max(255).required("Nome é obrigatório"),
					email: Yup.string().email("Digite um email válido").max(255).required("Email é obrigatório"),
					phone: Yup.string()
						.transform((value) => value.replace(/\D/g, ""))
						.matches(/^\d{11}$/, "Número de celular inválido")
						.required("Celular é obrigatório"),
					doc: Yup.string()
						.transform((value) => value.replace(/\D/g, ""))
						.matches(/^\d{11}(\d{3})?$/, "Número do documento inválido")
						.required("Documento é obrigatório"),
					pilot: isPilot === 1 ? Yup.string().max(255).required("Número do registro é obrigatório") : Yup.string().max(255),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting, setValues, resetForm }) => {
					try {
						const payload = {
							name: values.name,
							email: values.email,
							phone: values.phone.replace(/\D/g, ""),
							cpf: typeDoc === "cpf" ? values.doc.replace(/\D/g, "") : "",
							cnpj: typeDoc === "cnpj" ? values.doc.replace(/\D/g, "") : "",
							type: isPilot === 1 ? "P" : isPilot === 2 ? "R" : "C",
							pilotRegister: values.pilot,
						};

						const response = await createUserByAdmin(payload);
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
							err.response.status === 409 ? "Usuário já existe!" : err.response.status === 400 ? "Erro ao cadastrar usuário! Confira se os dados estão corretos!" : "Erro ao cadastrar usuário!";
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
										<InputLabel htmlFor="firstname-signup">Nome completo</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite seu nome..."
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
										<InputLabel htmlFor="email-signup">Email</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.email && errors.email)}
											id="email-login"
											type="email"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite seu email..."
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
										<InputLabel htmlFor="doc-signup">Documento</InputLabel>
										<RadioGroup row value={typeDoc} onChange={(e) => setTypeDoc(e.target.value)}>
											<FormControlLabel value="cpf" control={<Radio />} label="CPF" />
											<FormControlLabel value="cnpj" control={<Radio />} label="CNPJ" />
										</RadioGroup>
										<InputMask mask={typeDoc === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"} value={values.doc} onChange={handleChange} onBlur={handleBlur}>
											{() => <OutlinedInput fullWidth error={Boolean(touched.doc && errors.doc)} id="doc-signup" name="doc" placeholder="Digite o número do documento..." />}
										</InputMask>
										{touched.doc && errors.doc && (
											<FormHelperText error id="helper-text-doc-signup">
												{errors.doc}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="phone-signup">Celular</InputLabel>
										<InputMask mask={"(99) 99999-9999"} value={values.phone} onChange={handleChange} onBlur={handleBlur}>
											{() => <OutlinedInput fullWidth error={Boolean(touched.phone && errors.phone)} id="phone-signup" name="phone" placeholder="Digite o número do celular..." />}
										</InputMask>
										{touched.phone && errors.phone && (
											<FormHelperText error id="helper-text-phone-signup">
												{errors.phone}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="pilot-signup">Escolha o tipo de usuário</InputLabel>
										<RadioGroup row value={isPilot} onChange={(e) => setIsPilot(Number(e.target.value))}>
											<FormControlLabel value={1} control={<Radio />} label="Piloto" />
											<FormControlLabel value={2} control={<Radio />} label="Responsável" />
											<FormControlLabel value={3} control={<Radio />} label="Comum" />
										</RadioGroup>
										{isPilot === 1 && (
											<>
												<OutlinedInput
													fullWidth
													error={Boolean(touched.pilot && errors.pilot)}
													id="pilot-signup"
													value={values.pilot}
													name="pilot"
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder="Digite o número do registro de piloto..."
													inputProps={{}}
												/>
												{touched.pilot && errors.pilot && (
													<FormHelperText error id="helper-text-pilot-signup">
														{errors.pilot}
													</FormHelperText>
												)}
											</>
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

export default CreateUser;
