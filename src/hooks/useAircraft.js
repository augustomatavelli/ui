import { useContext } from "react";
import UseAxios from "./useAxios";
import AircraftContext from "contexts/AircraftContext";

import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useAircraft = () => {
	const { publicAxios } = UseAxios();
	const { setAircrafts, setAircraftDetails, setAircraftsPending } = useContext(AircraftContext);

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

	const findAllAircrafts = async () => {
		try {
			const response = await publicAxios.get("/aircrafts");
			setAircrafts(response.data);
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

	const findAllPendingAircrafts = async () => {
		try {
			const response = await publicAxios.get("/aircrafts/find-all-pending");
			setAircraftsPending(response.data);
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

	return { createAircraft, findAllAircrafts, findOneAircraftById, addLinkUserAircraft, removeLinkUserAircraft, findAllPendingAircrafts };
};

export default useAircraft;
