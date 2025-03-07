import AuthContext from "contexts/AuthContext";
import PropTypes from "prop-types";
import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// project import

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
	const { isLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!isLoggedIn) {
			navigate("login", {
				state: {
					from: location.pathname,
				},
				replace: true,
			});
			navigate("login", { replace: true });
		}
	}, [isLoggedIn, navigate, location]);

	return children;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
};

export default AuthGuard;
