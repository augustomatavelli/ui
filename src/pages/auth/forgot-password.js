import { Link } from "react-router-dom";
import { useContext } from "react";
import { Grid, Stack, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthForgotPassword from "sections/auth/auth-forms/AuthForgotPassword";
import AuthContext from "contexts/AuthContext";
import backgroundImageG from "../../assets/images/wallpaperLoginG.jpg";
import backgroundImageP from "../../assets/images/wallpaperLoginG.jpg";

const ForgotPassword = () => {
	const { isLoggedIn } = useContext(AuthContext);

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
						<Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
							<Typography variant="h3">Esqueci minha senha</Typography>
							<Typography component={Link} to={isLoggedIn ? "/auth/login" : "/"} variant="body1" sx={{ textDecoration: "none" }} color="primary">
								Voltar ao login
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<AuthForgotPassword />
					</Grid>
				</Grid>
			</AuthWrapper>
		</Box>
	);
};

export default ForgotPassword;
