import UseAxios from "./useAxios";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useRequest = () => {
	const { publicAxios } = UseAxios();

	const { setRequests, setTotalRequests, setSearchRequests, setTotalSearchRequests, setSearchAircraftsRequests, setTotalSearchAircraftsRequests } = useContext(RequestContext);

	const createRequest = async (data) => {
		try {
			const response = await publicAxios.post("/requests", data);
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
		}
	};

	const searchAllRequests = async (search, page) => {
		try {
			const response = await publicAxios.get(`/requests?search=${search}&page=${page}`);
			setSearchRequests(response.data.items);
			setTotalSearchRequests(response.data.pagination.totalPages);
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
		}
	};

	const searchMyAircraftsRequests = async (search, page) => {
		try {
			const response = await publicAxios.get(`/requests/aircrafts/me?search=${search}&page=${page}`);
			setSearchAircraftsRequests(response.data.items);
			setTotalSearchAircraftsRequests(response.data.pagination.totalPages);
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
		}
	};

	const findAllRequests = async (search, page) => {
		try {
			const response = await publicAxios.get(`/requests/admin/find-all?search=${search}&page=${page}`);
			setRequests(response.data.items);
			setTotalRequests(response.data.pagination.totalPages);
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
		}
	};

	const updateStatus = async (requestId) => {
		try {
			const response = await publicAxios.patch(`/requests/admin/update-status/${requestId}`);
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
		}
	};

	return { createRequest, findAllRequests, searchAllRequests, searchMyAircraftsRequests, updateStatus };
};

export default useRequest;
