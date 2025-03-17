import { Link } from "react-router-dom";
import { useContext } from "react";

// material-ui
import { Grid, Stack, Typography } from "@mui/material";

// project import
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthForgotPassword from "sections/auth/auth-forms/AuthForgotPassword";
import AuthContext from "contexts/AuthContext";

// ================================|| FORGOT PASSWORD ||================================ //

const ForgotPassword = () => {
	const { isLoggedIn } = useContext(AuthContext);

	return (
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
	);
};

export default ForgotPassword;
