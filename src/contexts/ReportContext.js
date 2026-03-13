import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
	const [loadingReport, setLoadingReport] = useState(false);
	const [reportFuelList, setReportFuelList] = useState([]);
	const [reportFuelListPDF, setReportFuelListPDF] = useState([]);
	const [reportTotalFuelList, setReportTotalFuelList] = useState();
	const [reportRequestsList, setReportRequestsList] = useState([]);
	const [period, setPeriod] = useState("day");

	const resetReportStates = useCallback(() => {
		setLoadingReport(false);
		setReportFuelList([]);
		setReportFuelListPDF([]);
		setReportRequestsList([]);
		setPeriod("day");
	}, []);

	const contextValue = useMemo(
		() => ({ loadingReport, setLoadingReport, reportFuelList, setReportFuelList, reportFuelListPDF, setReportFuelListPDF, reportTotalFuelList, setReportTotalFuelList, reportRequestsList, setReportRequestsList, period, setPeriod, resetReportStates }),
		[loadingReport, reportFuelList, reportFuelListPDF, reportTotalFuelList, reportRequestsList, period, resetReportStates]
	);

	return <ReportContext.Provider value={contextValue}>{children}</ReportContext.Provider>;
};

ReportProvider.propTypes = {
	children: PropTypes.node,
};

export default ReportContext;
