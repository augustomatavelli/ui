import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({});

	const resetUserStates = () => {
		setUser({});
	};

	return <UserContext.Provider value={{ user, setUser, resetUserStates }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
	children: PropTypes.node,
};

export default UserContext;
