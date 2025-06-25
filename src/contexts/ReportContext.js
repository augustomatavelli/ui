import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
	const { loadingReport, setLoadingReport } = useState(false);
	const { reportFuel, setReportFuel } = useState([]);

	const resetRequestStates = () => {
		setLoadingReport(false);
		setReportFuel([]);
	};

	return (
		<ReportContext.Provider
			value={{
				loadingReport,
				setLoadingReport,
				reportFuel,
				setReportFuel,
				resetRequestStates,
			}}
		>
			{children}
		</ReportContext.Provider>
	);
};

ReportProvider.propTypes = {
	children: PropTypes.node,
};

export default ReportContext;
