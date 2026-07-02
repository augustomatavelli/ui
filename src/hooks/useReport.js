import { useContext } from "react";
import UseAxios from "./useAxios";
import ReportContext from "contexts/ReportContext";
import { runRequest } from "utils/api/runRequest";

const useReport = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingReport, setReportFuelList, setReportTotalFuelList, setReportRequestsList, setReportFuelListPDF } = useContext(ReportContext);

	const reportFuel = async (period, start, end, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/reports/fuel?period=${period}&start=${start}&end=${end}`, { signal }), { setLoading: setLoadingReport });
		if (data) {
			setReportFuelList(data.items ?? []);
			setReportTotalFuelList(data.total);
			setReportFuelListPDF(data.pdfItems);
		}
	};

	const reportRequests = async (period, start, end, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/reports/requests?period=${period}&start=${start}&end=${end}`, { signal }), { setLoading: setLoadingReport });
		if (data) {
			setReportRequestsList(data.items ?? []);
		}
	};

	return { reportFuel, reportRequests };
};

export default useReport;
