import PropTypes from "prop-types";
import { useContext } from "react";
import { Button, DialogActions, DialogTitle, Divider, Grid, Stack } from "@mui/material";
import AddLinkUserAircraftTable from "sections/tables/aircrafts/AddLinkUserAircraft";
import AircraftContext from "contexts/AircraftContext";
import UserContext from "contexts/UserContext";
import { useParams } from "react-router-dom";
import useAircraft from "hooks/useAircraft";

const AddLinkUserAircraft = ({ setOpen }) => {
	const { findOneAircraftById } = useAircraft();

	const { setUserAircraftLink } = useContext(AircraftContext);
	const { setSearchUser } = useContext(UserContext);

	const { id } = useParams();

	const handleClose = async () => {
		setOpen(false);
		setUserAircraftLink("");
		setSearchUser([]);
		await findOneAircraftById(id);
	};

	return (
		<>
			<DialogTitle>Adicionar vínculo</DialogTitle>
			<Divider />
			<Grid>
				<AddLinkUserAircraftTable />
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

AddLinkUserAircraft.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddLinkUserAircraft;
