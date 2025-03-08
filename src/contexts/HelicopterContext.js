import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const HelicopterContext = createContext({});

export const HelicopterProvider = ({ children }) => {
	const [helicopters, setHelicopters] = useState([]);

	return <HelicopterContext.Provider value={{ helicopters, setHelicopters }}>{children}</HelicopterContext.Provider>;
};

HelicopterProvider.propTypes = {
	children: PropTypes.node,
};

export default HelicopterContext;
