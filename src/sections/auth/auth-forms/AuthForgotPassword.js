import { useNavigate } from "react-router-dom";

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import useAuth from "hooks/useAuth";
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "components/@extended/AnimateButton";

import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useContext } from "react";
import JWTContext from "contexts/JWTContext";

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
	const scriptedRef = useScriptRef();
	const navigate = useNavigate();

	const { isLoggedIn, resetPassword } = useContext(JWTContext);

	return (
		<>
			<Formik
				initialValues={{
					email: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string().email("Digite um email válido").max(255).required("Email é obrigatório"),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
					try {
						await resetPassword(values.email).then(
							() => {
								setStatus({ success: true });
								setSubmitting(false);
								dispatch(
									openSnackbar({
										open: true,
										message: "Check mail for reset password link",
										variant: "alert",
										alert: {
											color: "success",
										},
										close: false,
									})
								);
								setTimeout(() => {
									navigate(isLoggedIn ? "/auth/check-mail" : "/check-mail", { replace: true });
								}, 1500);

								// WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
								// Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
								// To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
								// github issue: https://github.com/formium/formik/issues/2430
							},
							(err) => {
								setStatus({ success: false });
								setErrors({ submit: err.message });
								setSubmitting(false);
							}
						);
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
									<InputLabel htmlFor="email-forgot">Email</InputLabel>
									<OutlinedInput
										fullWidth
										error={Boolean(touched.email && errors.email)}
										id="email-forgot"
										type="email"
										value={values.email}
										name="email"
										onBlur={handleBlur}
										onChange={handleChange}
										placeholder="Digite seu email"
										inputProps={{}}
									/>
									{touched.email && errors.email && (
										<FormHelperText error id="helper-text-email-forgot">
											{errors.email}
										</FormHelperText>
									)}
								</Stack>
							</Grid>
							{errors.submit && (
								<Grid item xs={12}>
									<FormHelperText error>{errors.submit}</FormHelperText>
								</Grid>
							)}
							{/* //TODO: usar o nodemailer para envio dos emails. Precisa definir o layout */}
							<Grid item xs={12}>
								<AnimateButton>
									<Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
										Enviar
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

export default AuthForgotPassword;
