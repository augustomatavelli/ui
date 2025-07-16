import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import OperatorContext from "contexts/OperatorContext";

const useOperator = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOperator, setOperators, setTotalOperators, setOperatorDetails, setSearchOperator } = useContext(OperatorContext);

	const createOperator = async (data) => {
		try {
			setLoadingOperator(true);
			const response = await publicAxios.post("/operators", data);
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
			setLoadingOperator(false);
		}
	};

	const findAllOperators = async (search, page) => {
		try {
			setLoadingOperator(true);
			const response = await publicAxios.get(`/operators/admin/find-all?search=${search}&page=${page}`);
			setOperators(response.data.items);
			setTotalOperators(response.data.pagination.totalPages);
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
			setLoadingOperator(false);
		}
	};

	const searchAllOperators = async (searchTerm, aircraftId, hasAircraft) => {
		try {
			setLoadingOperator(true);
			const response = await publicAxios.get(`/operators/search?search=${searchTerm}&aircraftId=${aircraftId}&hasAircraft=${hasAircraft}`);
			setSearchOperator(response.data);
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
			setLoadingOperator(false);
		}
	};

	const findOneOperatorById = async (operatorId) => {
		try {
			setLoadingOperator(true);
			const response = await publicAxios.get(`/operators/${operatorId}`);
			setOperatorDetails(response.data);
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
			setLoadingOperator(false);
		}
	};

	const updateOperator = async (operatorId, body) => {
		try {
			setLoadingOperator(true);
			const response = await publicAxios.patch(`/operators/admin/update/${operatorId}`, body);
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
			setLoadingOperator(false);
		}
	};

	return { createOperator, findAllOperators, findOneOperatorById, updateOperator, searchAllOperators };
};

export default useOperator;
