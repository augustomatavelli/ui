import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import OperationsContext from "contexts/OperationContext";

const useOperation = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOperation, setSearchOperations, setOperations, setTotalOperations, setCategories } = useContext(OperationsContext);

	const createOperation = async (data) => {
		try {
			setLoadingOperation(true);
			const response = await publicAxios.post("/operations", data);
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
			setLoadingOperation(false);
		}
	};

	const searchAllOperations = async () => {
		try {
			setLoadingOperation(true);
			const response = await publicAxios.get(`/operations`);
			setSearchOperations(response.data);
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
			setLoadingOperation(false);
		}
	};

	const findAllOperations = async (search, page, categoriesParams) => {
		try {
			setLoadingOperation(true);
			const response = await publicAxios.get(`/operations/admin/find-all?search=${search}&page=${page}&${categoriesParams.toString()}`);
			setOperations(response.data.items);
			setTotalOperations(response.data.pagination.totalPages);
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
			setLoadingOperation(false);
		}
	};

	const findCategories = async () => {
		try {
			setLoadingOperation(true);
			const response = await publicAxios.get(`/operations/categories`);
			setCategories(response.data);
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
			setLoadingOperation(false);
		}
	};

	const deleteOperation = async (operationId) => {
		try {
			setLoadingOperation(true);
			const response = await publicAxios.delete(`/operations/admin/delete/${operationId}`);
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
			setLoadingOperation(false);
		}
	};

	return { createOperation, findAllOperations, searchAllOperations, findCategories, deleteOperation };
};

export default useOperation;
