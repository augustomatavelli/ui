import UseAxios from "./useAxios";
import { useContext } from "react";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import InspectionContext from "contexts/InspectionsContext";

const useInspection = () => {
	const { publicAxios } = UseAxios();

	const { setInspections, setLoadingInspection } = useContext(InspectionContext);

	const findAllInspectionsByOrder = async (orderId) => {
		try {
			setLoadingInspection(true);
			const response = await publicAxios.get(`/inspections/${orderId}`);
			setInspections(response.data);
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
			setLoadingInspection(false);
		}
	};

	const updateInspectionOrderCompliance = async (orderId, data) => {
		try {
			setLoadingInspection(true);
			const response = await publicAxios.patch(`/inspections/${orderId}`, data);
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
			setLoadingInspection(false);
		}
	};

	return { findAllInspectionsByOrder, updateInspectionOrderCompliance };
};

export default useInspection;
