import { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Button, CircularProgress, Grid } from "@mui/material";
import OtpInput from "react18-input-otp";
import AnimateButton from "components/@extended/AnimateButton";
import { ThemeMode } from "config";
import useAuth from "hooks/useAuth";
import AuthContext from "contexts/AuthContext";
import { useNavigate } from "react-router";

const AuthCodeVerification = () => {
	const { checkResetPasswordCode } = useAuth();

	const { emailSent, loadingResetPassword } = useContext(AuthContext);

	const theme = useTheme();
	const [otp, setOtp] = useState();

	const navigate = useNavigate();

	const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

	const handleVerify = async () => {
		try {
			const payload = { code: otp, email: emailSent };
			await checkResetPasswordCode(payload);
			navigate("/reset-password", { replace: true });
		} catch (error) {
			// erro já tratado (snackbar) no hook useAuth
		}
	};

	useEffect(() => {
		if (!emailSent) {
			navigate("/", { replace: true });
		}
	}, [emailSent]);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<OtpInput
					value={otp}
					onChange={(otp) => setOtp(otp)}
					numInputs={6}
					containerStyle={{ justifyContent: "space-between" }}
					inputStyle={{
						width: "100%",
						margin: "8px",
						padding: "10px",
						border: `1px solid ${borderColor}`,
						borderRadius: 4,
						":hover": {
							borderColor: theme.palette.primary.main,
						},
					}}
					focusStyle={{
						outline: "none",
						boxShadow: theme.customShadows.primary,
						border: `1px solid ${theme.palette.primary.main}`,
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<AnimateButton>
					<Button disableElevation disabled={loadingResetPassword} fullWidth size="large" type="submit" variant="contained" onClick={handleVerify}>
						{loadingResetPassword ? <CircularProgress size={20} /> : "Verificar"}
					</Button>
				</AnimateButton>
			</Grid>
		</Grid>
	);
};

export default AuthCodeVerification;
