import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import LandingSiteContext from "contexts/LandingSiteContext";

const useLandingSite = () => {
	const { publicAxios } = UseAxios();

	const { setLandingSites, setTotalLandingSites, setSearchLandingSites, setUf } = useContext(LandingSiteContext);

	const createLandingSite = async (data) => {
		try {
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
		}
	};

	const searchAllLandingSites = async () => {
		try {
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
		}
	};

	const findAllLandingSites = async (search, page) => {
		try {
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
		}
	};

	const findUf = async () => {
		try {
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
		}
	};

	return { createLandingSite, findAllLandingSites, searchAllLandingSites, findUf };
};

export default useLandingSite;
