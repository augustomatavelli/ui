import { useContext } from "react";
import UseAxios from "./useAxios";
import AircraftContext from "contexts/AircraftContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import UserContext from "contexts/UserContext";

const useAircraft = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingAircraft, setSearchAircrafts, setAircraftDetails, setAircrafts, setTotalAircrafts, setTotalSearchAircrafts } = useContext(AircraftContext);
	const { setUsersResp } = useContext(UserContext);

	const createAircraft = async (data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.post("/aircrafts", data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const updateAircraft = async (aircraftId, data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.patch(`/aircrafts/admin/${aircraftId}`, data);
			dispatch(
				openSnackbar({
					open: true,
					message: response.data.message,
					variant: "alert",
					alert: {
						color: "success",
					},
					close: true,
				}),
			);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const updateAircraftImage = async (aircraftId, data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.patch(`/aircrafts/${aircraftId}`, data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const findOneAircraftById = async (aircraftId) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.get(`/aircrafts/${aircraftId}`);
			setAircraftDetails(response.data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const searchAllAircrafts = async (search, page) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.get(`/aircrafts?search=${search}&page=${page}`);
			setSearchAircrafts(response.data.items);
			setTotalSearchAircrafts(response.data.pagination.totalPages);
			setUsersResp(response.data.usersResp);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const addLinkUserAircraft = async (data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.post(`/aircrafts/link/add`, data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const addLinkOperatorAircraft = async (data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.post(`/aircrafts/link/operator/add`, data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const removeLinkUserAircraft = async (userId, aircraftId) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.delete(`/aircrafts/link/remove/${aircraftId}?userId=${userId}`);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const removeLinkOperatorAircraft = async (operatorId, aircraftId) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.delete(`/aircrafts/link/operator/remove/${aircraftId}?operatorId=${operatorId}`);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const findAllAircrafts = async (search, page, statusParams) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.get(`/aircrafts/admin/find-all?search=${search}&page=${page}&${statusParams.toString()}`);
			setAircrafts(response.data.items);
			setTotalAircrafts(response.data.pagination.totalPages);
			setUsersResp(response.data.usersResp);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const approveAircraft = async (data) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.patch("/aircrafts/admin/approve", data);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const deleteAircraft = async (aircraftId) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.delete(`/aircrafts/admin/delete/${aircraftId}`);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const anacSearch = async (search) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.get(`/rab-search/${search}`);
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
	};

	const toggleRestrictedAircraft = async (aircraftId, isRestricted) => {
		try {
			setLoadingAircraft(true);
			const response = await publicAxios.patch(`/aircrafts/admin/restricted/${aircraftId}`, { isRestricted });
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
				}),
			);
		} finally {
			setLoadingAircraft(false);
		}
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
