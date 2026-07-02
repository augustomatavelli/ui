import PropTypes from "prop-types";
import { Dialog } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import AddLinkUserAircraft from "sections/apps/aircrafts/AddLinkUserAircraft";
import ConfirmRemoveLinkUserAircraft from "sections/apps/aircrafts/ConfirmRemoveLinkUserAircraft";
import AddLinkOperatorAircraft from "sections/apps/aircrafts/AddLinkOperatorAircraft";

const AircraftLinkDialogs = ({ open, setOpen, openConfirmRemove, setOpenConfirmRemove, openOperator, setOpenOperator }) => {
	return (
		<>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpen(false);
				}}
				open={open}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<AddLinkUserAircraft setOpen={setOpen} />
			</Dialog>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpen(false);
				}}
				open={openConfirmRemove}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<ConfirmRemoveLinkUserAircraft setOpenConfirmRemove={setOpenConfirmRemove} />
			</Dialog>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpenOperator(false);
				}}
				open={openOperator}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<AddLinkOperatorAircraft setOpen={setOpenOperator} />
			</Dialog>
		</>
	);
};

AircraftLinkDialogs.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	openConfirmRemove: PropTypes.bool,
	setOpenConfirmRemove: PropTypes.func,
	openOperator: PropTypes.bool,
	setOpenOperator: PropTypes.func,
};

export default AircraftLinkDialogs;
