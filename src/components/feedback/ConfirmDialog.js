import PropTypes from "prop-types";

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";

// project import
import Avatar from "components/@extended/Avatar";
import { PopupTransition } from "components/@extended/Transitions";

// assets
import { ExclamationCircleOutlined } from "@ant-design/icons";

// ==============================|| FEEDBACK - CONFIRM DIALOG (genérico) ||============================== //

/**
 * Diálogo de confirmação genérico e reutilizável. Diferente do
 * AlertCustomerDelete, NÃO dispara snackbar nem navega — apenas chama
 * `onConfirm`/`onClose`, deixando o efeito colateral a cargo do chamador.
 */
export default function ConfirmDialog({
	open,
	title,
	description,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
	color = "error",
	icon,
	loading = false,
	onClose,
	onConfirm,
}) {
	return (
		<Dialog
			open={open}
			onClose={() => !loading && onClose?.()}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="xs"
			fullWidth
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="center" spacing={3.5}>
					<Avatar color={color} sx={{ width: 72, height: 72, fontSize: "1.75rem" }}>
						{icon || <ExclamationCircleOutlined />}
					</Avatar>
					<Stack spacing={2}>
						<Typography variant="h4" align="center" id="confirm-dialog-title">
							{title}
						</Typography>
						{description && (
							<Typography align="center" color="text.secondary" id="confirm-dialog-description">
								{description}
							</Typography>
						)}
					</Stack>
					<Stack direction="row" spacing={2} sx={{ width: 1 }}>
						<Button fullWidth onClick={() => onClose?.()} color="secondary" variant="outlined" disabled={loading}>
							{cancelText}
						</Button>
						<Button fullWidth color={color} variant="contained" onClick={() => onConfirm?.()} disabled={loading} autoFocus>
							{confirmText}
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

ConfirmDialog.propTypes = {
	open: PropTypes.bool,
	title: PropTypes.node,
	description: PropTypes.node,
	confirmText: PropTypes.string,
	cancelText: PropTypes.string,
	color: PropTypes.string,
	icon: PropTypes.node,
	loading: PropTypes.bool,
	onClose: PropTypes.func,
	onConfirm: PropTypes.func,
};
