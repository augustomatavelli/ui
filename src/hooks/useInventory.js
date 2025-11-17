import UseAxios from "./useAxios";
import { useContext } from "react";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import InventoryContext from "contexts/InventoryContext";

const useInventory = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingInventory, setInventoryList, setInventory, setTotalInventoryItems, setActualStock } = useContext(InventoryContext);

	const createInventory = async (body) => {
		try {
			setLoadingInventory(true);
			const response = await publicAxios.post("/inventory", body);
			return response.data;
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
			setLoadingInventory(false);
		}
	};

	const findAllInventoryList = async () => {
		try {
			setLoadingInventory(true);
			const response = await publicAxios.get("/inventory");
			setInventoryList(response.data);
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
			setLoadingInventory(false);
		}
	};

	const findAllInventory = async (inventoryId, searchTerm, page, type) => {
		try {
			setLoadingInventory(true);
			const response = await publicAxios.get(`/inventory/list/${inventoryId}?search=${searchTerm}&page=${page}&type=${type}`);
			setInventory(response.data.items);
			setTotalInventoryItems(response.data.pagination.totalPages);
			setActualStock(response.data.actualStock);
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
			setLoadingInventory(false);
		}
	};

	const deleteInventory = async (id) => {
		try {
			setLoadingInventory(true);
			const response = await publicAxios.delete(`/inventory/${id}`);
			return response.data;
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
			setLoadingInventory(false);
		}
	};

	return { createInventory, findAllInventoryList, findAllInventory, deleteInventory };
};

export default useInventory;
