import { useContext } from "react";
import UseAxios from "./useAxios";
import AircraftContext from "contexts/AircraftContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import UserContext from "contexts/UserContext";
import { runRequest } from "utils/api/runRequest";

const useAircraft = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingAircraft, setSearchAircrafts, setAircraftDetails, setAircrafts, setTotalAircrafts, setTotalSearchAircrafts } = useContext(AircraftContext);
	const { setUsersResp } = useContext(UserContext);

	const createAircraft = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/aircrafts", data), { setLoading: setLoadingAircraft });
		return result;
	};

	const updateAircraft = async (aircraftId, data) => {
		const { data: result, error } = await runRequest(() => publicAxios.patch(`/aircrafts/admin/${aircraftId}`, data), { setLoading: setLoadingAircraft });
		if (!error) {
			dispatch(
				openSnackbar({
					open: true,
					message: result?.message,
					variant: "alert",
					alert: {
						color: "success",
					},
					close: true,
				}),
			);
		}
		return result;
	};

	const updateAircraftImage = async (aircraftId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/aircrafts/${aircraftId}`, data), { setLoading: setLoadingAircraft });
		return result;
	};

	const findOneAircraftById = async (aircraftId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/aircrafts/${aircraftId}`, { signal }), { setLoading: setLoadingAircraft });
		if (data) {
			setAircraftDetails(data);
		}
	};

	const searchAllAircrafts = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/aircrafts?search=${search}&page=${page}`, { signal }), { setLoading: setLoadingAircraft });
		if (data) {
			setSearchAircrafts(data.items ?? []);
			setTotalSearchAircrafts(data.pagination?.totalPages ?? 0);
			setUsersResp(data.usersResp);
		}
	};

	const addLinkUserAircraft = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post(`/aircrafts/link/add`, data), { setLoading: setLoadingAircraft });
		return result;
	};

	const addLinkOperatorAircraft = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post(`/aircrafts/link/operator/add`, data), { setLoading: setLoadingAircraft });
		return result;
	};

	const removeLinkUserAircraft = async (userId, aircraftId) => {
		const { data: result } = await runRequest(() => publicAxios.delete(`/aircrafts/link/remove/${aircraftId}?userId=${userId}`), { setLoading: setLoadingAircraft });
		return result;
	};

	const removeLinkOperatorAircraft = async (operatorId, aircraftId) => {
		const { data: result } = await runRequest(() => publicAxios.delete(`/aircrafts/link/operator/remove/${aircraftId}?operatorId=${operatorId}`), { setLoading: setLoadingAircraft });
		return result;
	};

	const findAllAircrafts = async (search, page, statusParams, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/aircrafts/admin/find-all?search=${search}&page=${page}&${statusParams.toString()}`, { signal }), {
			setLoading: setLoadingAircraft,
		});
		if (data) {
			setAircrafts(data.items ?? []);
			setTotalAircrafts(data.pagination?.totalPages ?? 0);
			setUsersResp(data.usersResp);
		}
	};

	const approveAircraft = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.patch("/aircrafts/admin/approve", data), { setLoading: setLoadingAircraft });
		return result;
	};

	const deleteAircraft = async (aircraftId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/aircrafts/admin/delete/${aircraftId}`), { setLoading: setLoadingAircraft });
		return data;
	};

	const anacSearch = async (search) => {
		const { data } = await runRequest(() => publicAxios.get(`/rab-search/${search}`), { setLoading: setLoadingAircraft });
		return data;
	};

	const toggleRestrictedAircraft = async (aircraftId, isRestricted) => {
		const { data } = await runRequest(() => publicAxios.patch(`/aircrafts/admin/restricted/${aircraftId}`, { isRestricted }), { setLoading: setLoadingAircraft });
		return data;
	};

	return {
		createAircraft,
		searchAllAircrafts,
		findOneAircraftById,
		addLinkUserAircraft,
		removeLinkUserAircraft,
		findAllAircrafts,
		approveAircraft,
		deleteAircraft,
		anacSearch,
		toggleRestrictedAircraft,
		addLinkOperatorAircraft,
		removeLinkOperatorAircraft,
		updateAircraftImage,
		updateAircraft,
	};
};

export default useAircraft;
