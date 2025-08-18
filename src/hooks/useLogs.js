import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import LogContext from "contexts/LogContext";

const useLog = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingLog, setLogs, setTotalLogs } = useContext(LogContext);

	const findAllLogs = async (search, page, actionParams, entitiesParams) => {
		try {
			setLoadingLog(true);
			const response = await publicAxios.get(`/logs/admin?search=${search}&page=${page}&${actionParams.toString()}&${entitiesParams.toString()}`);
			setLogs(response.data.items);
			setTotalLogs(response.data.pagination.totalPages);
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
			setLoadingLog(false);
		}
	};

	return { findAllLogs };
};

export default useLog;
