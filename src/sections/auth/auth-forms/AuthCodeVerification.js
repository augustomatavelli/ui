import { useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Button, Grid, Stack, Typography } from "@mui/material";

// third-party
import OtpInput from "react18-input-otp";

// project import
import AnimateButton from "components/@extended/AnimateButton";
import { ThemeMode } from "config";

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = () => {
	const theme = useTheme();
	const [otp, setOtp] = useState();

	const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.grey[200] : theme.palette.grey[300];

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
					<Button disableElevation fullWidth size="large" type="submit" variant="contained">
						Verificar
					</Button>
				</AnimateButton>
			</Grid>
		</Grid>
	);
};

export default AuthCodeVerification;
