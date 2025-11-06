import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, InputLabel, InputAdornment, FormHelperText, OutlinedInput, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import { useContext, useState } from "react";
import UserContext from "contexts/UserContext";
import * as Yup from "yup";
import { Formik } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import useUser from "hooks/useUser";

export default function AlertUserPasswordExpired({ open, setOpen }) {
	const { updatePassword } = useUser();

	const { user, loadingUser } = useContext(UserContext);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Dialog open={open} keepMounted TransitionComponent={PopupTransition} maxWidth="xs" fullWidth aria-labelledby="column-delete-title" aria-describedby="column-delete-description">
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="start" spacing={3.5}>
					<Stack spacing={2} width={1}>
						<Typography variant="h4" align="left">
							Reset de senha
						</Typography>
						<Divider />
					</Stack>
					<Formik
						initialValues={{
							password: "",
							newPassword: "",
							confirmNewPassword: "",
							submit: null,
						}}
						validationSchema={Yup.object().shape({
							password: Yup.string().required("Senha é obrigatória"),
							newPassword: Yup.string()
								.required("Senha nova é obrigatória")
								.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
								.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
								.matches(/\d/, "A senha deve conter pelo menos um número")
								.matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial")
								.test("newPassword", "A senha nova não pode ser igual a atual", (newPassword, yup) => yup.parent.password !== newPassword),
							confirmNewPassword: Yup.string()
								.required("Senha nova é obrigatória")
								.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
								.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
								.matches(/\d/, "A senha deve conter pelo menos um número")
								.matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial")
								.test("confirmNewPassword", "As senhas devem ser iguais", (confirmNewPassword, yup) => yup.parent.newPassword === confirmNewPassword),
						})}
						onSubmit={async (values, { setErrors, setStatus, setSubmitting, setValues }) => {
							try {
								const { password, newPassword, confirmNewPassword } = values;
								const payload = { password: password, newPassword: newPassword, confirmNewPassword: confirmNewPassword };
								const response = await updatePassword(payload);
								if (response) {
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
									setStatus({ success: true });
									setSubmitting(false);
									setOpen(false);
								}
							} catch (err) {
								setStatus({ success: false });
								setErrors({ submit: err.message });
								setSubmitting(false);
							}
						}}
					>
						{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
							<form noValidate onSubmit={handleSubmit}>
								<Box sx={{ mb: 2 }}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="password-actual">Senha atual</InputLabel>
												<OutlinedInput
													fullWidth
													error={Boolean(touched.password && errors.password)}
													id="password-actual"
													type={"password"}
													value={values.password}
													name="password"
													onBlur={handleBlur}
													onChange={(e) => {
														handleChange(e);
													}}
													placeholder="Digite sua senha atual"
												/>
												{touched.password && errors.password && (
													<FormHelperText error id="helper-text-password-reset">
														{errors.password}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="password-reset">Senha nova</InputLabel>
												<OutlinedInput
													fullWidth
													error={Boolean(touched.newPassword && errors.newPassword)}
													id="password-reset"
													type={showPassword ? "text" : "password"}
													value={values.newPassword}
													name="newPassword"
													onBlur={handleBlur}
													onChange={(e) => {
														handleChange(e);
													}}
													endAdornment={
														<InputAdornment position="end">
															<IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" color="secondary">
																{showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
															</IconButton>
														</InputAdornment>
													}
													placeholder="Digite sua senha nova"
												/>
												{touched.newPassword && errors.newPassword && (
													<FormHelperText error id="helper-text-password-reset">
														{errors.newPassword}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1.25}>
												<InputLabel htmlFor="confirm-password-reset">Confirmar senha nova</InputLabel>
												<OutlinedInput
													fullWidth
													error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
													id="confirm-password-reset"
													type={showConfirmPassword ? "text" : "password"}
													value={values.confirmNewPassword}
													name="confirmNewPassword"
													onBlur={handleBlur}
													onChange={(e) => {
														handleChange(e);
													}}
													endAdornment={
														<InputAdornment position="end">
															<IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end" color="secondary">
																{showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
															</IconButton>
														</InputAdornment>
													}
													placeholder="Digite novamente sua senha nova"
												/>
												{touched.confirmNewPassword && errors.confirmNewPassword && (
													<FormHelperText error id="helper-text-confirm-password-reset">
														{errors.confirmNewPassword}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
									</Grid>
								</Box>
								<Divider />
								<Box>
									<Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
										<Button fullWidth disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
											Salvar
										</Button>
									</Stack>
								</Box>
							</form>
						)}
					</Formik>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertUserPasswordExpired.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.bool,
};
