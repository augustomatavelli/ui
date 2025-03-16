import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({});
	const [searchUser, setSearchUser] = useState([]);
	const [usersPending, setUsersPending] = useState([]);
	const [totalUserPending, setTotalUserPending] = useState(0);

	const resetUserStates = () => {
		setUser({});
		setSearchUser([]);
		setUsersPending([]);
		setTotalUserPending(0);
	};

	return (
		<UserContext.Provider value={{ user, setUser, searchUser, setSearchUser, usersPending, setUsersPending, totalUserPending, setTotalUserPending, resetUserStates }}>{children}</UserContext.Provider>
	);
};

UserProvider.propTypes = {
	children: PropTypes.node,
};

export default UserContext;
