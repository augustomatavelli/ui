import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const LandingSiteContext = createContext({});

export const LandingSiteProvider = ({ children }) => {
	const [landingSites, setLandingSites] = useState([]);

	const resetLandingSiteStates = () => {};

	return <LandingSiteContext.Provider value={{ landingSites, setLandingSites, resetLandingSiteStates }}>{children}</LandingSiteContext.Provider>;
};

LandingSiteProvider.propTypes = {
	children: PropTypes.node,
};

export default LandingSiteContext;
