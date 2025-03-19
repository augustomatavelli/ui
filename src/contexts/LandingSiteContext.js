import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const LandingSiteContext = createContext({});

export const LandingSiteProvider = ({ children }) => {
	const [landingSites, setLandingSites] = useState([]);
	const [totalLandingSites, setTotalLandingSites] = useState(0);

	const resetLandingSiteStates = () => {
		setLandingSites([]);
		setTotalLandingSites(0);
	};

	return <LandingSiteContext.Provider value={{ landingSites, setLandingSites, totalLandingSites, setTotalLandingSites, resetLandingSiteStates }}>{children}</LandingSiteContext.Provider>;
};

LandingSiteProvider.propTypes = {
	children: PropTypes.node,
};

export default LandingSiteContext;
