import UseAxios from "./useAxios";
import { useContext } from "react";
import InventoryContext from "contexts/InventoryContext";
import { runRequest } from "utils/api/runRequest";

const useInventory = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingInventory, setInventoryList, setInventory, setTotalInventoryItems, setActualStock, setStockHistory } = useContext(InventoryContext);

	const createInventory = async (body) => {
		const { data } = await runRequest(() => publicAxios.post("/inventory", body), { setLoading: setLoadingInventory });
		return data;
	};

	const findAllInventoryList = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get("/inventory", { signal }), { setLoading: setLoadingInventory });
		if (data) {
			setInventoryList(data);
		}
	};

	const findAllInventory = async (inventoryId, searchTerm, page, type, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/inventory/list/${inventoryId}?search=${searchTerm}&page=${page}&type=${type}`, { signal }), { setLoading: setLoadingInventory });
		if (data) {
			setInventory(data.items ?? []);
			setTotalInventoryItems(data.pagination?.totalPages ?? 0);
			setActualStock(data.actualStock);
			setStockHistory(data.stockHistory);
		}
	};

	const deleteInventory = async (id) => {
		const { data } = await runRequest(() => publicAxios.delete(`/inventory/${id}`), { setLoading: setLoadingInventory });
		return data;
	};

	return { createInventory, findAllInventoryList, findAllInventory, deleteInventory };
};

export default useInventory;
