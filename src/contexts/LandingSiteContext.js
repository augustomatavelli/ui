import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const LandingSiteContext = createContext({});

export const LandingSiteProvider = ({ children }) => {
	const [landingSites, setLandingSites] = useState([]);
	const [totalLandingSites, setTotalLandingSites] = useState(0);
	const [searchLandingSites, setSearchLandingSites] = useState([]);
	const [uf, setUf] = useState([]);

	const resetLandingSiteStates = () => {
		setLandingSites([]);
		setTotalLandingSites(0);
		setSearchLandingSites([]);
		setUf([]);
	};

	return (
		<LandingSiteContext.Provider value={{ landingSites, setLandingSites, totalLandingSites, setTotalLandingSites, searchLandingSites, setSearchLandingSites, uf, setUf, resetLandingSiteStates }}>
			{children}
		</LandingSiteContext.Provider>
	);
};

LandingSiteProvider.propTypes = {
	children: PropTypes.node,
};

export default LandingSiteContext;
