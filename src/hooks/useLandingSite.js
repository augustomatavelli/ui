import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import LandingSiteContext from "contexts/LandingSiteContext";

const useLandingSite = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingLandingSite, setLandingSites, setTotalLandingSites, setSearchLandingSites, setUf, setLandingSiteDetails } = useContext(LandingSiteContext);

	const createLandingSite = async (data) => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.post("/landing-sites", data);
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
			setLoadingLandingSite(false);
		}
	};

	const searchAllLandingSites = async () => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.get(`/landing-sites`);
			setSearchLandingSites(response.data);
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
			setLoadingLandingSite(false);
		}
	};

	const findAllLandingSites = async (search, page) => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.get(`/landing-sites/admin/find-all?search=${search}&page=${page}`);
			setLandingSites(response.data.items);
			setTotalLandingSites(response.data.pagination.totalPages);
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
			setLoadingLandingSite(false);
		}
	};

	const findUf = async () => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.get(`/landing-sites/uf`);
			setUf(response.data);
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
			setLoadingLandingSite(false);
		}
	};

	const findOneLandingSiteById = async (userId) => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.get(`/landing-sites/${userId}`);
			setLandingSiteDetails(response.data);
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
			setLoadingLandingSite(false);
		}
	};

	const deleteLandingSite = async (landingSiteId) => {
		try {
			setLoadingLandingSite(true);
			const response = await publicAxios.delete(`/landing-sites/admin/delete/${landingSiteId}`);
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
			setLoadingLandingSite(false);
		}
	};

	return { createLandingSite, findAllLandingSites, searchAllLandingSites, findUf, findOneLandingSiteById, deleteLandingSite };
};

export default useLandingSite;
