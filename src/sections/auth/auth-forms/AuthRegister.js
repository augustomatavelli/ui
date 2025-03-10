import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import { Box, Button, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import IconButton from "components/@extended/IconButton";
import AnimateButton from "components/@extended/AnimateButton";

import useScriptRef from "hooks/useScriptRef";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import InputMask from "react-input-mask";
import useAuth from "hooks/useAuth";

// ============================|| JWT - REGISTER ||============================ //

const AuthRegister = () => {
	const { createUser } = useAuth();

	const scriptedRef = useScriptRef();
	const navigate = useNavigate();

	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const [typeDoc, setTypeDoc] = useState("cpf");
	const [isPilot, setIsPilot] = useState(true);

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const changePassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	useEffect(() => {
		changePassword("");
	}, []);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					email: "",
					phone: "",
					doc: "",
					pilot: "",
					password: "",
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
					pilot: isPilot ? Yup.string().max(255).required("Número do registro é obrigatório") : Yup.string().max(255),
					password: Yup.string()
						.required("Senha é obrigatória")
						.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
						.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
						.matches(/\d/, "A senha deve conter pelo menos um número")
						.matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
					try {
						const payload = {
							name: values.name,
							email: values.email,
							phone: values.phone.replace(/\D/g, ""),
							cpf: typeDoc === "cpf" ? values.doc.replace(/\D/g, "") : "",
							cnpj: typeDoc === "cnpj" ? values.doc.replace(/\D/g, "") : "",
							type: isPilot ? "P" : "C",
							pilotRegister: values.pilot,
							password: values.password,
						};

						const response = await createUser(payload);
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
								navigate("/helicopters/me", { replace: true });
							}, 1500);
						}
					} catch (err) {
						setErrors({});
						console.error(err);
						const message =
							err.response.status === 409 ? "Usuário já cadastrado!" : err.response.status === 400 ? "Erro ao cadastrar usuário! Confira se os dados estão corretos!" : "Erro ao cadastrar usuário!";
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
										placeholder="Digite seu nome"
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
										placeholder="Digite seu email"
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
										{() => <OutlinedInput fullWidth error={Boolean(touched.doc && errors.doc)} id="doc-signup" name="doc" placeholder="Digite o número do documento" />}
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
										{() => <OutlinedInput fullWidth error={Boolean(touched.phone && errors.phone)} id="phone-signup" name="phone" placeholder="Digite o número do celular" />}
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
									<InputLabel htmlFor="pilot-signup">Você é piloto?</InputLabel>
									<RadioGroup row value={isPilot} onChange={(e) => setIsPilot(e.target.value === "true")}>
										<FormControlLabel value={true} control={<Radio />} label="Sim" />
										<FormControlLabel value={false} control={<Radio />} label="Não" />
									</RadioGroup>
									{isPilot && (
										<>
											<OutlinedInput
												fullWidth
												error={Boolean(touched.pilot && errors.pilot)}
												id="pilot-signup"
												value={values.pilot}
												name="pilot"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite o RAB"
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
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="password-signup">Senha</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.password && errors.password)}
										id="password-signup"
										type={showPassword ? "text" : "password"}
										value={values.password}
										name="password"
										onBlur={handleBlur}
										onChange={(e) => {
											handleChange(e);
											changePassword(e.target.value);
										}}
										endAdornment={
											<InputAdornment position="end">
												<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" color="secondary">
													{showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
												</IconButton>
											</InputAdornment>
										}
										placeholder="Digite sua senha"
										inputProps={{}}
									/>
									{touched.password && errors.password && (
										<FormHelperText error id="helper-text-password-signup">
											{errors.password}
										</FormHelperText>
									)}
								</Stack>
								{/* <FormControl fullWidth sx={{ mt: 2 }}>
									<Grid container spacing={2} alignItems="center">
										<Grid item>
											<Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: "7px" }} />
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" fontSize="0.75rem">
												{level?.label}
											</Typography>
										</Grid>
									</Grid>
								</FormControl> */}
							</Grid>
							{errors.submit && (
								<Grid item xs={12}>
									<FormHelperText error>{errors.submit}</FormHelperText>
								</Grid>
							)}
							<Grid item xs={12}>
								<AnimateButton>
									<Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
										Cadastrar
									</Button>
								</AnimateButton>
							</Grid>
						</Grid>
					</form>
				)}
			</Formik>
		</>
	);
};

export default AuthRegister;
