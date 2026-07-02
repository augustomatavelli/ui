import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AuthContext from "contexts/AuthContext";
import UserContext from "contexts/UserContext";

const AuthGuard = ({ children, requiredUserType }) => {
	const { isLoggedIn } = useContext(AuthContext);
	const { user } = useContext(UserContext);

	const navigate = useNavigate();
	const location = useLocation();

	return children;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
	requiredUserType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default AuthGuard;
