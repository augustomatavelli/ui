import UseAxios from "./useAxios";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";

const useRequest = () => {
	const { publicAxios } = UseAxios();

	const { setRequests } = useContext(RequestContext);

	const createRequest = async (data) => {
		try {
			const response = await publicAxios.post("/requests", data);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			console.log(err);
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

	const findAllRequests = async (search) => {
		try {
			const response = await publicAxios.get(`/requests/find-all?search=${search}`);
			setRequests(response.data);
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

	return { createRequest, findAllRequests };
};

export default useRequest;
