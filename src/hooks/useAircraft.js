import { useContext } from "react";
import UseAxios from "./useAxios";
import AircraftContext from "contexts/AircraftContext";

import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useAircraft = () => {
	const { publicAxios } = UseAxios();
	const { setAircrafts, setAircraftDetails, setAircraftsPending, setTotalAircraftPending, setTotalAircraft } = useContext(AircraftContext);

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

	const findAllAircrafts = async (search, page) => {
		try {
			const response = await publicAxios.get(`/aircrafts?search=${search}&page=${page}`);
			setAircrafts(response.data.items);
			setTotalAircraft(response.data.pagination.totalPages);
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

	const findAllPendingAircrafts = async (search, page) => {
		try {
			const response = await publicAxios.get(`/aircrafts/find-all-pending?search=${search}&page=${page}`);
			setAircraftsPending(response.data.items);
			setTotalAircraftPending(response.data.pagination.totalPages);
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

	const approveAircraft = async (data) => {
		try {
			const response = await publicAxios.patch("/aircrafts/approve", data);
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

	return { createAircraft, findAllAircrafts, findOneAircraftById, addLinkUserAircraft, removeLinkUserAircraft, findAllPendingAircrafts, approveAircraft };
};

export default useAircraft;
