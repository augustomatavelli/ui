import PropTypes from "prop-types";
import { useContext } from "react";
import { Button, DialogActions, DialogTitle, Divider, Grid, Stack } from "@mui/material";
import AircraftContext from "contexts/AircraftContext";
import { useParams } from "react-router-dom";
import useAircraft from "hooks/useAircraft";
import AddLinkOperatorAircraftTable from "sections/tables/aircrafts/AddLinkOperatorAircraft";
import OperatorContext from "contexts/OperatorContext";

const AddLinkOperatorAircraft = ({ setOpen }) => {
	const { findOneAircraftById } = useAircraft();

	const { setSearchOperatorAircraftLink } = useContext(AircraftContext);
	const { setSearchOperator } = useContext(OperatorContext);

	const { id } = useParams();

	const handleClose = async () => {
		setOpen(false);
		setSearchOperatorAircraftLink("");
		setSearchOperator([]);
		await findOneAircraftById(id);
	};

	return (
		<>
			<DialogTitle>Adicionar vínculo</DialogTitle>
			<Divider />
			<Grid>
				<AddLinkOperatorAircraftTable />
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

AddLinkOperatorAircraft.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddLinkOperatorAircraft;
