import PropTypes from "prop-types";
import { Box, Stack, Button } from "@mui/material";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";

const AircraftActions = ({ user, registration, id_aircraft, openAlert, onBack, onOpenAlert, handleAlertClose, deleteAircraft }) => {
	return (
		<Box sx={{ p: 2.5 }}>
			<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }} spacing={2}>
				<Button variant="outlined" color="error" onClick={onBack}>
					Voltar
				</Button>
				{(user.type === "A" || user.type === "S") /* && users && !users.some((item) => item.id_user === Number(userId)) */ && (
					<Button variant="contained" color="error" onClick={onOpenAlert}>
						Excluir
					</Button>
				)}
				<AlertCustomerDelete title={registration} open={openAlert} handleClose={handleAlertClose} id={id_aircraft} handleDelete={deleteAircraft} />
			</Stack>
		</Box>
	);
};

AircraftActions.propTypes = {
	user: PropTypes.object,
	registration: PropTypes.string,
	id_aircraft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	openAlert: PropTypes.bool,
	onBack: PropTypes.func,
	onOpenAlert: PropTypes.func,
	handleAlertClose: PropTypes.func,
	deleteAircraft: PropTypes.func,
};

export default AircraftActions;
