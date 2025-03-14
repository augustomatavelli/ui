import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [searchUser, setSearchUser] = useState([]);
	const [usersPending, setUsersPending] = useState([]);

	const resetUserStates = () => {
		setUser({});
		setSearchUser([]);
		setUsersPending([]);
	};

	return <UserContext.Provider value={{ user, setUser, searchUser, setSearchUser, usersPending, setUsersPending, resetUserStates }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
	children: PropTypes.node,
};

export default UserContext;
