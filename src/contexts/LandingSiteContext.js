import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const LandingSiteContext = createContext({});

export const LandingSiteProvider = ({ children }) => {
	const [loadingLandingSite, setLoadingLandingSite] = useState(false);
	const [landingSites, setLandingSites] = useState([]);
	const [totalLandingSites, setTotalLandingSites] = useState(0);
	const [searchLandingSites, setSearchLandingSites] = useState([]);
	const [uf, setUf] = useState([]);
	const [landingSiteDetails, setLandingSiteDetails] = useState({});

	const resetLandingSiteStates = useCallback(() => {
		setLoadingLandingSite(false);
		setLandingSites([]);
		setTotalLandingSites(0);
		setSearchLandingSites([]);
		setUf([]);
		setLandingSiteDetails({});
	}, []);

	const contextValue = useMemo(
		() => ({
			loadingLandingSite, setLoadingLandingSite,
			landingSites, setLandingSites,
			totalLandingSites, setTotalLandingSites,
			searchLandingSites, setSearchLandingSites,
			uf, setUf,
			landingSiteDetails, setLandingSiteDetails,
			resetLandingSiteStates,
		}),
		[loadingLandingSite, landingSites, totalLandingSites, searchLandingSites, uf, landingSiteDetails, resetLandingSiteStates]
	);

	return <LandingSiteContext.Provider value={contextValue}>{children}</LandingSiteContext.Provider>;
};

LandingSiteProvider.propTypes = {
	children: PropTypes.node,
};

export default LandingSiteContext;
