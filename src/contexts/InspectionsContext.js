import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const InspectionContext = createContext({});

export const InspectionProvider = ({ children }) => {
	const [loadingInspection, setLoadingInspection] = useState(false);
	const [inspections, setInspections] = useState([]);

	const resetInspectionStates = useCallback(() => {
		setLoadingInspection(false);
		setInspections([]);
	}, []);

	const contextValue = useMemo(
		() => ({ inspections, setInspections, loadingInspection, setLoadingInspection, resetInspectionStates }),
		[inspections, loadingInspection, resetInspectionStates]
	);

	return <InspectionContext.Provider value={contextValue}>{children}</InspectionContext.Provider>;
};

InspectionProvider.propTypes = {
	children: PropTypes.node,
};

export default InspectionContext;
