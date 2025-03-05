// material-ui
import { Grid, Stack, Typography } from "@mui/material";

// project import
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthCodeVerification from "sections/auth/auth-forms/AuthCodeVerification";

// ================================|| CODE VERIFICATION ||================================ //

const CodeVerification = () => (
	<AuthWrapper>
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Stack spacing={1}>
					<Typography variant="h3">Verificação de dois fatores</Typography>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<Typography>Digite o código que foi enviado para o email ****@company.com</Typography>
			</Grid>
			<Grid item xs={12}>
				<AuthCodeVerification />
			</Grid>
		</Grid>
	</AuthWrapper>
);

export default CodeVerification;
