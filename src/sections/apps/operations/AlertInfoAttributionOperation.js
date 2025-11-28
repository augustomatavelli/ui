import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, Stack, Typography, useTheme } from "@mui/material";

import { PopupTransition } from "components/@extended/Transitions";

export default function AlertInfoAttributionOperation({ open, handleClose }) {
	const theme = useTheme();

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="xs"
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="center" spacing={3.5}>
					<Stack spacing={2}>
						<Typography variant="h4" align="start">
							Descrição do tipo de atribuição
						</Typography>
						<Typography variant="subtitle2">
							<Typography component="span" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
								Manual:
							</Typography>{" "}
							O serviço aparecerá como opção a ser escolhida pelo usuário.
						</Typography>
						<Typography variant="subtitle2">
							<Typography component="span" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
								Automático:
							</Typography>{" "}
							O serviço será disparado automaticamente ao abrir a solicitação.
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2} sx={{ width: 1 }}>
						<Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertInfoAttributionOperation.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
