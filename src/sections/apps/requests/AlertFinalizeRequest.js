import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import Avatar from "components/@extended/Avatar";
import { PopupTransition } from "components/@extended/Transitions";
import { DeleteOutlined } from "@ant-design/icons";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";

export default function AlertFinalizeRequest({ id, open, handleClose, handleDelete }) {
	const { loadingRequest } = useContext(RequestContext);

	return (
		<Dialog
			open={open}
			onClose={() => handleClose()}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="sm"
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="center" spacing={3.5}>
					<Avatar color="success" sx={{ width: 72, height: 72, fontSize: "1.75rem" }}>
						<DeleteOutlined />
					</Avatar>
					<Stack spacing={2}>
						<Typography variant="h4" align="center">
							Tem certeza que deseja finalizar a solicitação
							<Typography variant="h4" component="span">
								{" "}
								# {id}
							</Typography>
							?
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2} sx={{ width: 1 }}>
						<Button fullWidth onClick={() => handleClose()} color="secondary" variant="outlined" disabled={loadingRequest}>
							Fechar
						</Button>
						<Button
							fullWidth
							color="primary"
							variant="contained"
							disabled={loadingRequest}
							onClick={async () => {
								const response = await handleDelete(Number(id));
								handleClose();
								dispatch(
									openSnackbar({
										open: true,
										message: response.message,
										variant: "alert",
										alert: {
											color: "success",
										},
										close: false,
									})
								);
							}}
							autoFocus
						>
							Confirmar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertFinalizeRequest.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
