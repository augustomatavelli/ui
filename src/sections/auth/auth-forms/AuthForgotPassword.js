import { useNavigate } from "react-router-dom";

// material-ui
import { Button, CircularProgress, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from "@mui/material";

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
import AuthContext from "contexts/AuthContext";

const AuthForgotPassword = () => {
	const { requestResetPasswordCode } = useAuth();

	const scriptedRef = useScriptRef();
	const navigate = useNavigate();

	const { loadingResetPassword, setEmailSent } = useContext(AuthContext);

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
						await requestResetPasswordCode(values).then(
							(res) => {
								setStatus({ success: true });
								setSubmitting(false);
								dispatch(
									openSnackbar({
										open: true,
										message: res.message,
										variant: "alert",
										alert: {
											color: "success",
										},
										close: false,
									})
								);

								setEmailSent(values.email);
								navigate("/code-verification", { replace: true });
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
										{loadingResetPassword ? <CircularProgress size={20} /> : "Enviar"}
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
