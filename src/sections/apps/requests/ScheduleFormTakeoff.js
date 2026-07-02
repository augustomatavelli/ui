import PropTypes from "prop-types";
import ScheduleForm from "./ScheduleForm";

// Wrapper fino: mantém a API antiga (landingCheckbox/setLandingCheckbox)
// e delega para o componente unificado ScheduleForm no modo "takeoff".
const ScheduleFormTakeoff = ({ aircraft, onValidate, landingCheckbox, setLandingCheckbox, ...rest }) => (
	<ScheduleForm mode="takeoff" aircraft={aircraft} onValidate={onValidate} secondaryCheckbox={landingCheckbox} setSecondaryCheckbox={setLandingCheckbox} {...rest} />
);

ScheduleFormTakeoff.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
	landingCheckbox: PropTypes.bool,
	setLandingCheckbox: PropTypes.func,
};

export default ScheduleFormTakeoff;
