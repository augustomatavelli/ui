import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
	const [loadingNotification, setLoadingNotification] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [totalNotification, setTotalNotifications] = useState(0);

	const resetNotificationStates = () => {
		setLoadingNotification(false);
		loadingNotification([]);
		setTotalNotifications(0);
	};

	return (
		<NotificationContext.Provider value={{ resetNotificationStates, notifications, setNotifications, loadingNotification, setLoadingNotification, totalNotification, setTotalNotifications }}>
			{children}
		</NotificationContext.Provider>
	);
};

NotificationProvider.propTypes = {
	children: PropTypes.node,
};

export default NotificationContext;
