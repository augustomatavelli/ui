import { useContext } from "react";
import UseAxios from "./useAxios";
import UserContext from "contexts/UserContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useUser = () => {
	const { publicAxios } = UseAxios();
	const { setUser, setSearchUser, setUsersPending, setTotalUserPending } = useContext(UserContext);

	const createUserByAdmin = async (data) => {
		try {
			const response = await publicAxios.post("/users/by-admin", data);
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

	const findOneUser = async () => {
		try {
			const response = await publicAxios.get("/users");
			setUser(response.data);
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

	const findAllUsers = async (searchTerm, aircraftId, hasAircraft) => {
		try {
			const response = await publicAxios.get(`/users/find-all?search=${searchTerm}&aircraftId=${aircraftId}&hasAircraft=${hasAircraft}`);
			setSearchUser(response.data);
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

	const findAllPendingUsers = async (search, page) => {
		try {
			const response = await publicAxios.get(`/users/find-all-pending?search=${search}&page=${page}`);
			setUsersPending(response.data.items);
			setTotalUserPending(response.data.pagination.totalPages);
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

	const updatePassword = async (data) => {
		try {
			const response = await publicAxios.patch("/users", data);
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

	const approveUser = async (data) => {
		try {
			const response = await publicAxios.patch("/users/approve", data);
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

	return { findOneUser, updatePassword, findAllUsers, findAllPendingUsers, approveUser, createUserByAdmin };
};

export default useUser;
