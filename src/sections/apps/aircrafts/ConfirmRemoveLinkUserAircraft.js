import PropTypes from "prop-types";
import { useContext } from "react";

// material-ui
import { Button, DialogActions, DialogTitle, Divider, Grid, Stack } from "@mui/material";

// third-party.png
import ConfirmRemoveLinkUserAircraftTable from "sections/tables/aircrafts/ConfirmRemoveLinkUserAircraft";
import AircraftContext from "contexts/AircraftContext";
import UserContext from "contexts/UserContext";

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const ConfirmRemoveLinkUserAircraft = ({ setOpenConfirmRemove }) => {
	const { setUserAircraftLink } = useContext(AircraftContext);
	const { setSearchUser } = useContext(UserContext);

	return (
		<>
			<DialogTitle>Remover vínculo</DialogTitle>
			<Divider />
			<Grid>
				<ConfirmRemoveLinkUserAircraftTable />
			</Grid>
			<Divider />
			<DialogActions sx={{ p: 2.5 }}>
				<Grid container justifyContent="flex-end" alignItems="center">
					<Grid item>
						<Stack direction="row" spacing={2} alignItems="center">
							<Button
								color="error"
								onClick={() => {
									setOpenConfirmRemove(false);
									setUserAircraftLink("");
									setSearchUser([]);
								}}
							>
								Fechar
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</DialogActions>
		</>
	);
};

ConfirmRemoveLinkUserAircraft.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default ConfirmRemoveLinkUserAircraft;
