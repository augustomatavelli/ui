import PropTypes from "prop-types";
import { Box, Stack, Button } from "@mui/material";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";

const RequestActions = ({ status, user, id_user, id_request, showSave, openAlert, onBack, onSave, onOpenAlert, handleAlertClose, deleteRequest }) => {
	return (
		<Box sx={{ p: 2.5 }}>
			<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
				<Button variant="outlined" color="error" onClick={onBack}>
					Voltar
				</Button>
				{showSave && (
					<Button variant="contained" onClick={onSave}>
						Salvar
					</Button>
				)}
				{status === "A" && (user.type === "A" || user.type === "S" || id_user === user.id_user) && (
					<Button variant="contained" color="error" onClick={onOpenAlert}>
						Cancelar solicitação
					</Button>
				)}
				<AlertCustomerDelete title={`a solicitação #${id_request}`} open={openAlert} handleClose={handleAlertClose} id={id_request} handleDelete={deleteRequest} cancel={true} />
			</Stack>
		</Box>
	);
};

RequestActions.propTypes = {
	status: PropTypes.string,
	user: PropTypes.object,
	id_user: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	id_request: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	showSave: PropTypes.bool,
	openAlert: PropTypes.bool,
	onBack: PropTypes.func,
	onSave: PropTypes.func,
	onOpenAlert: PropTypes.func,
	handleAlertClose: PropTypes.func,
	deleteRequest: PropTypes.func,
};

export default RequestActions;
