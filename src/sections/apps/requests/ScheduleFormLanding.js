import PropTypes from "prop-types";
import ScheduleForm from "./ScheduleForm";

// Wrapper fino: mantém a API antiga (takeoffCheckbox/setTakeoffCheckbox)
// e delega para o componente unificado ScheduleForm no modo "landing".
const ScheduleFormLanding = ({ aircraft, onValidate, takeoffCheckbox, setTakeoffCheckbox, ...rest }) => (
	<ScheduleForm mode="landing" aircraft={aircraft} onValidate={onValidate} secondaryCheckbox={takeoffCheckbox} setSecondaryCheckbox={setTakeoffCheckbox} {...rest} />
);

ScheduleFormLanding.propTypes = {
	aircraft: PropTypes.any,
	onCancel: PropTypes.func,
	onValidate: PropTypes.func.isRequired,
	takeoffCheckbox: PropTypes.bool,
	setTakeoffCheckbox: PropTypes.func,
};

export default ScheduleFormLanding;
