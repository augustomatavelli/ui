import { Grid, Stack, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthResetPassword from "sections/auth/auth-forms/AuthResetPassword";
import backgroundImageG from "../../assets/images/wallpaperLoginG.jpg";
import backgroundImageP from "../../assets/images/wallpaperLoginG.jpg";

const ResetPassword = () => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
						<Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
							<Typography variant="h3">Reset de senha</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<AuthResetPassword />
					</Grid>
				</Grid>
			</AuthWrapper>
		</Box>
	);
};

export default ResetPassword;
