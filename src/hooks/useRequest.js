import UseAxios from "./useAxios";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";

const useRequest = () => {
	const { publicAxios } = UseAxios();

	const { setRequests, setTotalRequests, setSearchRequests, setTotalSearchRequests } = useContext(RequestContext);

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
			const response = await publicAxios.post(`/requests?search=${search}&page=${page}`);
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

	return { createRequest, findAllRequests, searchAllRequests };
};

export default useRequest;
