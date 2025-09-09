import UseAxios from "./useAxios";
import { useContext } from "react";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import NotificationContext from "contexts/NotificationContext";

const useNotification = () => {
	const { publicAxios } = UseAxios();

	const { setNotifications, setLoadingNotification, setTotalNotifications } = useContext(NotificationContext);

	const findAllNotifications = async (page, status, preview) => {
		try {
			setLoadingNotification(true);
			const url = preview !== undefined ? `/notifications?page=${page}&status=${status}&preview=${preview}` : `/notifications?page=${page}&status=${status}`;
			const response = await publicAxios.get(url);
			setNotifications(response.data.items);
			setTotalNotifications(response.data.totalPages);
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
			setLoadingNotification(false);
		}
	};

	const updateNotificationAsRead = async (data, action) => {
		try {
			setLoadingNotification(true);
			const response = await publicAxios.patch(`/notifications?action=${action}`, data);
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
			setLoadingNotification(false);
		}
	};

	return { findAllNotifications, updateNotificationAsRead };
};

export default useNotification;
