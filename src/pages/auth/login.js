import { Link } from "react-router-dom";
import { useContext } from "react";
import { Box, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthLogin from "sections/auth/auth-forms/AuthLogin";
import AuthContext from "contexts/AuthContext";
import backgroundImageG from "../../assets/images/wallpaperLoginG.jpg";
import backgroundImageP from "../../assets/images/wallpaperLoginG.jpg";

const Login = () => {
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
							<Typography variant="h3">Login</Typography>
							<Typography component={Link} to={isLoggedIn ? "/auth/register" : "/register"} variant="body1" sx={{ textDecoration: "none" }} color="primary">
								Não tem uma conta?
							</Typography>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<AuthLogin isDemo={isLoggedIn} />
					</Grid>
				</Grid>
			</AuthWrapper>
		</Box>
	);
};

export default Login;
