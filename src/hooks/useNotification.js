import UseAxios from "./useAxios";
import { useContext } from "react";
import NotificationContext from "contexts/NotificationContext";
import { runRequest } from "utils/api/runRequest";

const useNotification = () => {
	const { publicAxios } = UseAxios();

	const { setNotifications, setLoadingNotification, setTotalNotifications } = useContext(NotificationContext);

	const findAllNotifications = async (page, status, preview, signal) => {
		const url = preview !== undefined ? `/notifications?page=${page}&status=${status}&preview=${preview}` : `/notifications?page=${page}&status=${status}`;
		const { data } = await runRequest(() => publicAxios.get(url, { signal }), { setLoading: setLoadingNotification });
		if (data) {
			setNotifications(data.items ?? []);
			setTotalNotifications(data.totalPages ?? 0);
		}
		return data;
	};

	const updateNotificationAsRead = async (data, action) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/notifications?action=${action}`, data), { setLoading: setLoadingNotification });
		return result;
	};

	return { findAllNotifications, updateNotificationAsRead };
};

export default useNotification;
