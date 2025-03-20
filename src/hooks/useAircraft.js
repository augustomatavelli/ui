import { useContext } from "react";
import UseAxios from "./useAxios";
import AircraftContext from "contexts/AircraftContext";

import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import UserContext from "contexts/UserContext";

const useAircraft = () => {
	const { publicAxios } = UseAxios();

	const { setSearchAircrafts, setAircraftDetails, setAircrafts, setTotalAircrafts, setTotalSearchAircrafts } = useContext(AircraftContext);
	const { setUsersResp } = useContext(UserContext);

	const createAircraft = async (data) => {
		try {
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
				})
			);
		}
	};

	const findOneAircraftById = async (aircraftId) => {
		try {
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
				})
			);
		}
	};

	const searchAllAircrafts = async (search, page) => {
		try {
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
				})
			);
		}
	};

	const addLinkUserAircraft = async (data) => {
		try {
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
				})
			);
		}
	};

	const removeLinkUserAircraft = async (userId, aircraftId) => {
		try {
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
				})
			);
		}
	};

	const findAllAircrafts = async (search, page) => {
		try {
			const response = await publicAxios.get(`/aircrafts/admin/find-all?search=${search}&page=${page}`);
			setAircrafts(response.data.items);
			setTotalAircrafts(response.data.pagination.totalPages);
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

	const approveAircraft = async (data) => {
		try {
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
				})
			);
		}
	};

	return { createAircraft, searchAllAircrafts, findOneAircraftById, addLinkUserAircraft, removeLinkUserAircraft, findAllAircrafts, approveAircraft };
};

export default useAircraft;
