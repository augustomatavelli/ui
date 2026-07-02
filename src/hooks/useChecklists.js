import UseAxios from "./useAxios";
import { useContext } from "react";
import ChecklistContext from "contexts/ChecklistContext";
import { runRequest } from "utils/api/runRequest";

const useChecklist = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingChecklist, setChecklists, setTotalChecklists, setActiveChecklists } = useContext(ChecklistContext);

	const createChecklist = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/checklists", data), { setLoading: setLoadingChecklist });
		return result;
	};

	const findAllChecklists = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/checklists/admin/find-all?search=${search}&page=${page}`, { signal }), { setLoading: setLoadingChecklist });
		if (data) {
			setChecklists(data.items ?? []);
			setTotalChecklists(data.pagination?.totalPages ?? 0);
		}
	};

	const findAllActive = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get("/checklists/admin/find-all/active", { signal }), { setLoading: setLoadingChecklist });
		if (data) {
			setActiveChecklists(data);
		}
	};

	const toggleStatus = async (checklistId) => {
		await runRequest(() => publicAxios.patch(`/checklists/admin/status/${checklistId}`), { setLoading: setLoadingChecklist });
	};

	return { findAllChecklists, toggleStatus, createChecklist, findAllActive };
};

export default useChecklist;
