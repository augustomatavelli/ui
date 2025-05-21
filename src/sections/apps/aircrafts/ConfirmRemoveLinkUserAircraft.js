import PropTypes from "prop-types";
import { useContext } from "react";
import { Button, DialogActions, DialogTitle, Divider, Grid, Stack } from "@mui/material";
import ConfirmRemoveLinkUserAircraftTable from "sections/tables/aircrafts/ConfirmRemoveLinkUserAircraft";
import AircraftContext from "contexts/AircraftContext";
import UserContext from "contexts/UserContext";
import { useParams } from "react-router-dom";
import useAircraft from "hooks/useAircraft";

const ConfirmRemoveLinkUserAircraft = ({ setOpenConfirmRemove }) => {
	const { findOneAircraftById } = useAircraft();

	const { setUserAircraftLink } = useContext(AircraftContext);
	const { setSearchUser } = useContext(UserContext);

	const { id } = useParams();

	const handleClose = async () => {
		setOpenConfirmRemove(false);
		setUserAircraftLink("");
		setSearchUser([]);
		await findOneAircraftById(id);
	};

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
							<Button color="error" onClick={handleClose}>
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
