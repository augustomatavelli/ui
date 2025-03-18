import { useContext } from "react";
import UseAxios from "./useAxios";
import UserContext from "contexts/UserContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import AuthContext from "contexts/AuthContext";

const useUser = () => {
	const { publicAxios } = UseAxios();

	const { setSession } = useContext(AuthContext);
	const { setUser, setSearchUser, setUsers, setTotalUser } = useContext(UserContext);

	const createUser = async (data) => {
		try {
			const response = await publicAxios.post("/users", data);
			const { token, userType, userId, userStatus } = response.data;
			setSession(token);
			localStorage.setItem("_userId", userId);
			localStorage.setItem("_type", userType);
			localStorage.setItem("_status", userStatus);
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

	const createUserByAdmin = async (data) => {
		try {
			const response = await publicAxios.post("/users/admin/create", data);
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
			const response = await publicAxios.get("/users/find-one");
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

	const searchAllUsers = async (searchTerm, aircraftId, hasAircraft) => {
		try {
			const response = await publicAxios.get(`/users/search?search=${searchTerm}&aircraftId=${aircraftId}&hasAircraft=${hasAircraft}`);
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

	const findAllUsers = async (search, page) => {
		try {
			const response = await publicAxios.get(`/users/admin/find-all?search=${search}&page=${page}`);
			setUsers(response.data.items);
			setTotalUser(response.data.pagination.totalPages);
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
			const response = await publicAxios.patch("/users/update-password", data);
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
			const response = await publicAxios.patch("/users/admin/approve", data);
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

	return { findOneUser, updatePassword, searchAllUsers, findAllUsers, approveUser, createUserByAdmin, createUser };
};

export default useUser;
