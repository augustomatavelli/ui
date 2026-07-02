import UseAxios from "./useAxios";
import { useContext } from "react";
import LogContext from "contexts/LogContext";
import { runRequest } from "utils/api/runRequest";

const useLog = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingLog, setLogs, setTotalLogs } = useContext(LogContext);

	const findAllLogs = async (search, page, actionParams, entitiesParams, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/logs/admin?search=${search}&page=${page}&${actionParams.toString()}&${entitiesParams.toString()}`, { signal }), {
			setLoading: setLoadingLog,
		});
		if (data) {
			setLogs(data.items ?? []);
			setTotalLogs(data.pagination?.totalPages ?? 0);
		}
	};

	return { findAllLogs };
};

export default useLog;
