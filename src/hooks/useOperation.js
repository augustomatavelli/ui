import UseAxios from "./useAxios";
import { useContext } from "react";
import OperationsContext from "contexts/OperationContext";
import { runRequest } from "utils/api/runRequest";

const useOperation = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOperation, setSearchOperations, setOperations, setTotalOperations, setCategories, setOperationDetails, setIcons } = useContext(OperationsContext);

	const createOperation = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/operations", data), { setLoading: setLoadingOperation });
		return result;
	};

	const searchAllOperations = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operations`, { signal }), { setLoading: setLoadingOperation });
		if (data) {
			setSearchOperations(data);
		}
	};

	const findAllOperations = async (search, page, categoriesParams, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operations/admin/find-all?search=${search}&page=${page}&${categoriesParams.toString()}`, { signal }), {
			setLoading: setLoadingOperation,
		});
		if (data) {
			setOperations(data.items ?? []);
			setTotalOperations(data.pagination?.totalPages ?? 0);
		}
	};

	const findOneOperationById = async (productId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operations/admin/${productId}`, { signal }), { setLoading: setLoadingOperation });
		if (data) {
			setOperationDetails(data);
		}
	};

	const findCategories = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operations/categories`, { signal }), { setLoading: setLoadingOperation });
		if (data) {
			setCategories(data);
		}
	};

	const findIcons = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/operations/icons`, { signal }), { setLoading: setLoadingOperation });
		if (data) {
			setIcons(data);
		}
	};

	const deleteOperation = async (operationId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/operations/admin/delete/${operationId}`), { setLoading: setLoadingOperation });
		return data;
	};

	const updateOperation = async (operationId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/operations/admin/update/${operationId}`, { ...data }), { setLoading: setLoadingOperation });
		return result;
	};

	return { createOperation, findAllOperations, searchAllOperations, findCategories, deleteOperation, findOneOperationById, updateOperation, findIcons };
};

export default useOperation;
