import { useContext } from "react";
import UseAxios from "./useAxios";
import UserContext from "contexts/UserContext";
import { runRequest } from "utils/api/runRequest";

const useUser = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingUser, setUser, setSearchUser, setUsers, setTotalUser, setUserDetails } = useContext(UserContext);

	const createUser = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/users", data), { setLoading: setLoadingUser });
		return result;
	};

	const createUserByAdmin = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/users/admin/create", data), { setLoading: setLoadingUser });
		return result;
	};

	const findOneUser = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get("/users/find-one", { signal }), { setLoading: setLoadingUser });
		if (data) {
			setUser(data);
		}
	};

	const findOneUserById = async (userId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/users/find-one/${userId}`, { signal }), { setLoading: setLoadingUser });
		if (data) {
			setUserDetails(data);
		}
	};

	const searchAllUsers = async (searchTerm, aircraftId, hasAircraft, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/users/search?search=${searchTerm}&aircraftId=${aircraftId}&hasAircraft=${hasAircraft}`, { signal }), {
			setLoading: setLoadingUser,
		});
		if (data) {
			setSearchUser(data);
		}
	};

	const findAllUsers = async (search, page, roleParams, statusParams, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/users/admin/find-all?search=${search}&page=${page}&${roleParams.toString()}&${statusParams.toString()}`, { signal }), {
			setLoading: setLoadingUser,
		});
		if (data) {
			setUsers(data.items ?? []);
			setTotalUser(data.pagination?.totalPages ?? 0);
		}
	};

	const updateUser = async (userId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/users/admin/${userId}`, data), { setLoading: setLoadingUser });
		return result;
	};

	const updateUserPassword = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.patch("/users/update-password", data), { setLoading: setLoadingUser });
		return result;
	};

	const approveUser = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.patch("/users/admin/approve", data), { setLoading: setLoadingUser });
		return result;
	};

	const deleteUser = async (userId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/users/admin/delete/${userId}`), { setLoading: setLoadingUser });
		return data;
	};

	return { findOneUser, updateUserPassword, updateUser, searchAllUsers, findAllUsers, approveUser, createUserByAdmin, createUser, findOneUserById, deleteUser };
};

export default useUser;
