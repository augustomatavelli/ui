import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import { Box, Button, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { useContext } from "react";

// project import
import IconButton from "components/@extended/IconButton";
import AnimateButton from "components/@extended/AnimateButton";

import useScriptRef from "hooks/useScriptRef";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import AuthContext from "contexts/AuthContext";

// ============================|| STATIC - RESET PASSWORD ||============================ //

const AuthResetPassword = () => {
	const scriptedRef = useScriptRef();
	const navigate = useNavigate();

	const { isLoggedIn } = useContext(AuthContext);

	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
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
		<Formik
			initialValues={{
				password: "",
				confirmPassword: "",
				submit: null,
			}}
			validationSchema={Yup.object().shape({
				password: Yup.string().max(255).required("Senha é obrigatória"),
				confirmPassword: Yup.string()
					.required("Senha é obrigatória")
					.test("confirmPassword", "As senhas devem ser iguais!", (confirmPassword, yup) => yup.parent.password === confirmPassword),
			})}
			onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
				try {
					// password reset
					if (scriptedRef.current) {
						setStatus({ success: true });
						setSubmitting(false);

						dispatch(
							openSnackbar({
								open: true,
								message: "Successfuly reset password.",
								variant: "alert",
								alert: {
									color: "success",
								},
								close: false,
							})
						);

						setTimeout(() => {
							navigate(isLoggedIn ? "/auth/login" : "/", { replace: true });
						}, 1500);
					}
				} catch (err) {
					console.error(err);
					if (scriptedRef.current) {
						setStatus({ success: false });
						setErrors({ submit: err.message });
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
								<InputLabel htmlFor="password-reset">Nova senha</InputLabel>
								<OutlinedInput
									fullWidth
									error={Boolean(touched.password && errors.password)}
									id="password-reset"
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
									placeholder="Digite sua senha nova..."
								/>
								{touched.password && errors.password && (
									<FormHelperText error id="helper-text-password-reset">
										{errors.password}
									</FormHelperText>
								)}
							</Stack>
						</Grid>
						<Grid item xs={12}>
							<Stack spacing={1}>
								<InputLabel htmlFor="confirm-password-reset">Confirmar nova senha</InputLabel>
								<OutlinedInput
									fullWidth
									error={Boolean(touched.confirmPassword && errors.confirmPassword)}
									id="confirm-password-reset"
									type="password"
									value={values.confirmPassword}
									name="confirmPassword"
									onBlur={handleBlur}
									onChange={handleChange}
									placeholder="Digite novamente sua senha nova..."
								/>
								{touched.confirmPassword && errors.confirmPassword && (
									<FormHelperText error id="helper-text-confirm-password-reset">
										{errors.confirmPassword}
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
							<AnimateButton>
								<Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
									Atualizar
								</Button>
							</AnimateButton>
						</Grid>
					</Grid>
				</form>
			)}
		</Formik>
	);
};

export default AuthResetPassword;
