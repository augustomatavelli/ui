import PropTypes from "prop-types";

// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from "@mui/material";

// project import
import Avatar from "components/@extended/Avatar";
import { PopupTransition } from "components/@extended/Transitions";

// assets
import { DeleteOutlined } from "@ant-design/icons";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useNavigate } from "react-router";

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertCustomerDelete({ title, open, handleClose, id, handleDelete }) {
	const navigate = useNavigate();

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
					<Avatar color="error" sx={{ width: 72, height: 72, fontSize: "1.75rem" }}>
						<DeleteOutlined />
					</Avatar>
					<Stack spacing={2}>
						<Typography variant="h4" align="center">
							Tem certeza que deseja excluir
							<Typography variant="h4" component="span">
								{" "}
								&quot;{title}&quot;
							</Typography>
							?
						</Typography>
					</Stack>

					<Stack direction="row" spacing={2} sx={{ width: 1 }}>
						<Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button
							fullWidth
							color="error"
							variant="contained"
							onClick={async () => {
								const response = await handleDelete(Number(id));
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
								handleClose(false);
								navigate(-1);
							}}
							autoFocus
						>
							Excluir
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertCustomerDelete.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
