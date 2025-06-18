import { Grid, Stack, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import AuthContext from "contexts/AuthContext";
import { useContext } from "react";
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthCodeVerification from "sections/auth/auth-forms/AuthCodeVerification";
import backgroundImageG from "../../assets/images/wallpaperLoginG.jpg";
import backgroundImageP from "../../assets/images/wallpaperLoginG.jpg";

const CodeVerification = () => {
	const { emailSent } = useContext(AuthContext);

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const mascararEmail = (email) => {
		if (email) {
			const [user, domain] = email.split("@");
			const first = user.slice(0, 1);
			const last = user.slice(-1);
			const maskedUser = `${first}${"*".repeat(user.length - 2)}${last}`;
			return `${maskedUser}@${domain}`;
		}
	};

	return (
		<Box
			sx={{
				backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), ${isSmallScreen ? `url(${backgroundImageP})` : `url(${backgroundImageG})`}`,
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
				minHeight: "100vh",
				width: "100vw",
			}}
		>
			<AuthWrapper>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Stack spacing={1}>
							<Typography variant="h3">Verificação de dois fatores</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Typography>Digite o código que foi enviado para o email {mascararEmail(emailSent)}</Typography>
					</Grid>
					<Grid item xs={12}>
						<AuthCodeVerification />
					</Grid>
				</Grid>
			</AuthWrapper>
		</Box>
	);
};

export default CodeVerification;
