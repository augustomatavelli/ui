// material-ui
import { useState } from "react";
import { Box, Button, Divider, Grid, InputLabel, Stack, TextField, Chip, InputAdornment, FormHelperText, OutlinedInput } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useContext } from "react";
import UserContext from "contexts/UserContext";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useUser from "hooks/useUser";
import { useNavigate } from "react-router";

const UserProfile = () => {
	const { updateUserPassword } = useUser();

	const { user } = useContext(UserContext);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();

	const typeUser = localStorage.getItem("_type");

	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() - 18);

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
		<MainCard
			content={false}
			title="Perfil"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				typeUser != "S" && (
					<Chip
						color={typeUser === "P" ? "success" : typeUser === "A" ? "info" : typeUser === "O" ? "primary" : "warning"}
						variant="filled"
						size="medium"
						label={typeUser === "P" ? "Piloto" : typeUser === "A" ? "Administrador" : typeUser === "O" ? "Operador" : "Comum"}
						sx={{ fontWeight: "bold" }}
					/>
				)
			}
		>
			<Formik
				initialValues={{
					name: user.name,
					email: user.email,
					phone: user.mobile,
					license: user.license,
					newPassword: "",
					confirmNewPassword: "",
					submit: null,
				}}
				validationSchema={Yup.object().shape({
					newPassword: Yup.string()
						.required("Senha é obrigatória")
						.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
						.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
						.matches(/\d/, "A senha deve conter pelo menos um número")
						.matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial"),
					confirmNewPassword: Yup.string()
						.required("Senha é obrigatória")
						.required("Senha é obrigatória")
						.matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
						.matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
						.matches(/\d/, "A senha deve conter pelo menos um número")
						.matches(/[\W_]/, "A senha deve conter pelo menos um caractere especial")
						.test("confirmNewPassword", "As senhas devem ser iguais", (confirmNewPassword, yup) => yup.parent.newPassword === confirmNewPassword),
				})}
				onSubmit={async (values, { setErrors, setStatus, setSubmitting, setValues }) => {
					try {
						const { newPassword, confirmNewPassword } = values;
						const payload = { newPassword: newPassword, confirmNewPassword: confirmNewPassword };
						const response = await updateUserPassword(payload);
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
								}),
							);
							setStatus({ success: true });
							setSubmitting(false);
							setTimeout(() => {
								navigate("/aircrafts/me");
							}, 1000);
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
						<Box sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} sm={6}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="personal-name">Nome</InputLabel>
										<TextField fullWidth id="personal-name" value={values.name} name="name" disabled />
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="personal-email">Email</InputLabel>
										<TextField fullWidth id="personal-email" value={values.email} name="email" disabled />
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="personal-phone">Celular</InputLabel>
										<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
											<TextField fullWidth id="personal-phone" value={values.phone} name="phone" disabled />
										</Stack>
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Stack spacing={1.25}>
										<InputLabel htmlFor="personal-license">Número ANAC</InputLabel>
										<TextField fullWidth value={values.license ? values.license : "-"} name="license" id="personal-license" disabled />
									</Stack>
								</Grid>
								<Grid item xs={12} sm={6}>
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
								<Grid item xs={12} sm={6}>
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
						<Box sx={{ p: 2.5 }}>
							<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
								<Button variant="outlined" color="error" onClick={() => window.history.back()}>
									Voltar
								</Button>
								<Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
									Salvar
								</Button>
							</Stack>
						</Box>
					</form>
				)}
			</Formik>
		</MainCard>
	);
};

export default UserProfile;
