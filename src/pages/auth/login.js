import { Link } from "react-router-dom";
import { useContext } from "react";

// material-ui
import { Grid, Stack, Typography } from "@mui/material";

// project import
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthLogin from "sections/auth/auth-forms/AuthLogin";
import AuthContext from "contexts/AuthContext";

// ================================|| LOGIN ||================================ //

const Login = () => {
	const { isLoggedIn } = useContext(AuthContext);

	return (
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
	);
};

export default Login;
