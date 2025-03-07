import PropTypes from "prop-types";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Button, FormHelperText, Grid, Link, InputAdornment, InputLabel, OutlinedInput, Stack } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import useScriptRef from "hooks/useScriptRef";
import IconButton from "components/@extended/IconButton";
import AnimateButton from "components/@extended/AnimateButton";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ isDemo = false }) => {
	const { login } = useAuth();

	const scriptedRef = useScriptRef();

	const [showPassword, setShowPassword] = React.useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<Formik
				initialValues={{
					email: "",
					password: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string().email("Digite um email válido").max(255).required("Email é obrigatório"),
					password: Yup.string().max(255).required("Senha é obrigatória"),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
					try {
						const payload = {
							login: values.email,
							password: values.password,
						};
						await login(payload);
						if (scriptedRef.current) {
							setStatus({ success: true });
							setSubmitting(false);
						}
					} catch (err) {
						setErrors({});
						console.error(err);
						const message = err.response.status === 404 ? "Usuário não encontrado!" : "Erro ao fazer login!";
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
									<InputLabel htmlFor="email-login">Email</InputLabel>
									<OutlinedInput
										id="email-login"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder="Digite seu email"
										fullWidth
										error={Boolean(touched.email && errors.email)}
									/>
									{touched.email && errors.email && (
										<FormHelperText error id="standard-weight-helper-text-email-login">
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							<Grid item xs={12}>
								<Stack spacing={1}>
									<InputLabel htmlFor="password-login">Senha</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.password && errors.password)}
										id="-password-login"
										type={showPassword ? "text" : "password"}
										value={values.password}
										name="password"
										onBlur={handleBlur}
										onChange={handleChange}
										endAdornment={
											<InputAdornment position="end">
												<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" color="secondary">
													{showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
												</IconButton>
											</InputAdornment>
										}
										placeholder="Digite sua senha"
									/>
									{touched.password && errors.password && (
										<FormHelperText error id="standard-weight-helper-text-password-login">
											{errors.password}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							{/* //TODO: fluxo da recuperação de senha: 
							//1. ao clicar no botão esqueceu sua senha, o usuário é redirecionado para a página forgot-password
							//2. usuário vai para a página code-verification
							//3. usuário vai para a página reset-password */}
							<Grid item xs={12} sx={{ mt: -1 }}>
								<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
									<Link variant="h6" component={RouterLink} to={isDemo ? "/auth/forgot-password" : "/forgot-password"} color="text.primary">
										Esqueceu a senha?
									</Link>
								</Stack>
							</Grid>
							{errors.submit && (
								<Grid item xs={12}>
									<FormHelperText error>{errors.submit}</FormHelperText>
								</Grid>
							)}
							<Grid item xs={12}>
								<AnimateButton>
									<Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
										Login
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

AuthLogin.propTypes = {
	isDemo: PropTypes.bool,
};

export default AuthLogin;
