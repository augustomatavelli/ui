import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const HelicopterContext = createContext({});

export const HelicopterProvider = ({ children }) => {
	const [helicopters, setHelicopters] = useState([]);
	const [helicopterDetails, setHelicopterDetails] = useState({});

	const resetHelicopterStates = () => {
		setHelicopters([]);
		setHelicopterDetails({});
	};

	return <HelicopterContext.Provider value={{ helicopters, setHelicopters, helicopterDetails, setHelicopterDetails, resetHelicopterStates }}>{children}</HelicopterContext.Provider>;
};

HelicopterProvider.propTypes = {
	children: PropTypes.node,
};

export default HelicopterContext;
