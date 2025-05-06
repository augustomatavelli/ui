// material-ui
import { Grid, Stack, Typography } from "@mui/material";
import AuthContext from "contexts/AuthContext";
import { useContext } from "react";

// project import
import AuthWrapper from "sections/auth/AuthWrapper";
import AuthCodeVerification from "sections/auth/auth-forms/AuthCodeVerification";

const CodeVerification = () => {
	const { emailSent } = useContext(AuthContext);

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
	);
};

export default CodeVerification;
