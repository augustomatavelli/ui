import { useContext } from "react";
import UseAxios from "./useAxios";
import ReportContext from "contexts/ReportContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useReport = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingReport, setReportFuelList } = useContext(ReportContext);

	const reportFuel = async (period, start, end) => {
		try {
			setLoadingReport(true);
			const response = await publicAxios.get(`/reports/fuel?period=${period}&start=${start}&end=${end}`);
			setReportFuelList(response.data.items);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingReport(false);
		}
	};

	return { reportFuel };
};

export default useReport;
