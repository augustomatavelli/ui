import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
	const [loadingNotification, setLoadingNotification] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [totalNotification, setTotalNotifications] = useState(0);

	const resetNotificationStates = useCallback(() => {
		setLoadingNotification(false);
		setNotifications([]);
		setTotalNotifications(0);
	}, []);

	const contextValue = useMemo(
		() => ({
			notifications, setNotifications,
			loadingNotification, setLoadingNotification,
			totalNotification, setTotalNotifications,
			resetNotificationStates,
		}),
		[notifications, loadingNotification, totalNotification, resetNotificationStates]
	);

	return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
};

NotificationProvider.propTypes = {
	children: PropTypes.node,
};

export default NotificationContext;
