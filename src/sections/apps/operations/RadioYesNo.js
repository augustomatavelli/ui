import PropTypes from "prop-types";
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";

/**
 * RadioGroup Sim/Não reutilizável.
 * Preserva o markup dos RadioGroups originais (value "S"/"N").
 */
const RadioYesNo = ({ value, defaultValue = "N", onChange, children }) => {
	return (
		<RadioGroup aria-label="size" value={value} defaultValue={defaultValue} name="radio-buttons-group" onChange={onChange} row>
			<FormControlLabel value="S" control={<Radio />} label="Sim" />
			<FormControlLabel value="N" control={<Radio />} label="Não" />
			{children}
		</RadioGroup>
	);
};

RadioYesNo.propTypes = {
	value: PropTypes.string,
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
	children: PropTypes.node,
};

export default RadioYesNo;
