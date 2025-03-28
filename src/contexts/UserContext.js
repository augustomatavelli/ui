import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
	const [loadingUser, setLoadingUser] = useState(false);
	const [user, setUser] = useState({});
	const [searchUser, setSearchUser] = useState([]);
	const [users, setUsers] = useState([]);
	const [totalUser, setTotalUser] = useState(0);
	const [usersResp, setUsersResp] = useState([]);
	const [userDetails, setUserDetails] = useState({});

	const resetUserStates = () => {
		setLoadingUser(false);
		setUser({});
		setSearchUser([]);
		setUsers([]);
		setTotalUser(0);
		setUsersResp([]);
		setUserDetails({});
	};

	return (
		<UserContext.Provider
			value={{ loadingUser, setLoadingUser, user, setUser, searchUser, setSearchUser, users, setUsers, totalUser, setTotalUser, usersResp, setUsersResp, userDetails, setUserDetails, resetUserStates }}
		>
			{children}
		</UserContext.Provider>
	);
};

UserProvider.propTypes = {
	children: PropTypes.node,
};

export default UserContext;
