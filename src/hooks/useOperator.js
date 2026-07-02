import UseAxios from "./useAxios";
import { useContext } from "react";
import OperatorContext from "contexts/OperatorContext";
import { runRequest } from "utils/api/runRequest";

const useOperator = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOperator, setOperators, setTotalOperators, setOperatorDetails, setSearchOperator } = useContext(OperatorContext);

	const createOperator = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/operators", data), { setLoading: setLoadingOperator });
		return result;
	};

	const findAllOperators = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operators/admin/find-all?search=${search}&page=${page}`, { signal }), { setLoading: setLoadingOperator });
		if (data) {
			setOperators(data.items ?? []);
			setTotalOperators(data.pagination?.totalPages ?? 0);
		}
	};

	const searchAllOperators = async (searchTerm, aircraftId, hasAircraft, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operators/search?search=${searchTerm}&aircraftId=${aircraftId}&hasAircraft=${hasAircraft}`, { signal }), {
			setLoading: setLoadingOperator,
		});
		if (data) {
			setSearchOperator(data);
		}
	};

	const findOneOperatorById = async (operatorId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operators/${operatorId}`, { signal }), { setLoading: setLoadingOperator });
		if (data) {
			setOperatorDetails(data);
		}
	};

	const updateOperator = async (operatorId, body) => {
		const { data } = await runRequest(() => publicAxios.patch(`/operators/admin/update/${operatorId}`, body), { setLoading: setLoadingOperator });
		return data;
	};

	return { createOperator, findAllOperators, findOneOperatorById, updateOperator, searchAllOperators };
};

export default useOperator;
