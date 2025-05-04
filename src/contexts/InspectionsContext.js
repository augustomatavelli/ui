import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const InspectionContext = createContext({});

export const InspectionProvider = ({ children }) => {
	const [loadingInspection, setLoadingInspection] = useState(false);
	const [inspections, setInspections] = useState([]);

	const resetInspectionStates = () => {
		setLoadingInspection(false);
		loadingInspection([]);
	};

	return <InspectionContext.Provider value={{ inspections, setInspections, loadingInspection, setLoadingInspection, resetInspectionStates }}>{children}</InspectionContext.Provider>;
};

InspectionProvider.propTypes = {
	children: PropTypes.node,
};

export default InspectionContext;
