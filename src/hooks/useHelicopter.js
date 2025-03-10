import { useContext } from "react";
import UseAxios from "./useAxios";
import HelicopterContext from "contexts/HelicopterContext";

import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const useHelicopter = () => {
	const { publicAxios } = UseAxios();
	const { setHelicopters } = useContext(HelicopterContext);

	const createHelicopter = async (data) => {
		try {
			const response = await publicAxios.post("/helicopters", data);
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

	const findAllHelicopters = async () => {
		try {
			const response = await publicAxios.get("/helicopters");
			setHelicopters(response.data);
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

	return { createHelicopter, findAllHelicopters };
};

export default useHelicopter;
