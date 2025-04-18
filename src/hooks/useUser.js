import { useContext } from "react";
import UseAxios from "./useAxios";
import UserContext from "contexts/UserContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useUser = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingUser, setUser, setSearchUser, setUsers, setTotalUser, setUserDetails } = useContext(UserContext);

	const createUser = async (data) => {
		try {
			setLoadingUser(true);
			const response = await publicAxios.post("/users", data);
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
			setLoadingUser(false);
		}
	};

	const createUserByAdmin = async (data) => {
		try {
			setLoadingUser(true);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const findOneUser = async () => {
		try {
			setLoadingUser(true);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const findOneUserById = async (userId) => {
		try {
			setLoadingUser(true);
			const response = await publicAxios.get(`/users/find-one/${userId}`);
			setUserDetails(response.data);
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
			setLoadingUser(false);
		}
	};

	const searchAllUsers = async (searchTerm, aircraftId, hasAircraft) => {
		try {
			setLoadingUser(true);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const findAllUsers = async (search, page, roleParams, statusParams) => {
		console.log(roleParams, statusParams);
		try {
			setLoadingUser(true);
			const response = await publicAxios.get(`/users/admin/find-all?search=${search}&page=${page}&${roleParams.toString()}&${statusParams.toString()}`);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const updatePassword = async (data) => {
		try {
			setLoadingUser(true);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const approveUser = async (data) => {
		try {
			setLoadingUser(true);
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
		} finally {
			setLoadingUser(false);
		}
	};

	const deleteUser = async (userId) => {
		try {
			setLoadingUser(true);
			const response = await publicAxios.delete(`/users/admin/delete/${userId}`);
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
			setLoadingUser(false);
		}
	};

	return { findOneUser, updatePassword, searchAllUsers, findAllUsers, approveUser, createUserByAdmin, createUser, findOneUserById, deleteUser };
};

export default useUser;
