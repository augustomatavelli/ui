import PropTypes from "prop-types";
import { createContext, useState } from "react";
import dayjs from "dayjs";

export const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
	const [loadingReport, setLoadingReport] = useState(false);
	const [reportFuelList, setReportFuelList] = useState([]);
	const [period, setPeriod] = useState("day");

	const resetRequestStates = () => {
		setLoadingReport(false);
		setReportFuelList([]);
		setPeriod("day");
	};

	return (
		<ReportContext.Provider
			value={{
				loadingReport,
				setLoadingReport,
				reportFuelList,
				setReportFuelList,
				resetRequestStates,
				period,
				setPeriod,
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
