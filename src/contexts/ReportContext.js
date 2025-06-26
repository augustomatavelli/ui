import PropTypes from "prop-types";
import { createContext, useState } from "react";
import dayjs from "dayjs";

export const ReportContext = createContext({});

export const ReportProvider = ({ children }) => {
	const [loadingReport, setLoadingReport] = useState(false);
	const [reportFuelList, setReportFuelList] = useState([]);
	const [period, setPeriod] = useState("day");
	const [reportDateFilter, setReportDateFilter] = useState({
		start: dayjs().subtract(6, "day").startOf("day"),
		end: dayjs().endOf("day"),
	});
	console.log(reportDateFilter);
	const resetRequestStates = () => {
		setLoadingReport(false);
		setReportFuelList([]);
		setPeriod("day");
		setReportDateFilter({
			start: dayjs().subtract(6, "day").startOf("day"),
			end: dayjs().endOf("day"),
		});
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
				reportDateFilter,
				setReportDateFilter,
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
