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

	/* useEffect(() => {
		const allowedTypes = typeof requiredUserType === "string" ? requiredUserType : requiredUserType;

		if (user && !allowedTypes.includes(user.type)) {
			switch (user.type) {
				case "A":
					navigate("/users/admin", { replace: true });
					break;
				case "O":
					navigate("/aircrafts/me", { replace: true });
					break;
				case "P":
					navigate("/aircrafts/me", { replace: true });
					break;
				case "C":
					navigate("/aircrafts/me", { replace: true });
					break;
				default:
					navigate("/", { replace: true });
					break;
			}
		} else if (!isLoggedIn) {
			navigate("/", {
				state: { from: location.pathname },
				replace: true,
			});
		}
	}, [isLoggedIn, user, navigate, location, requiredUserType]); */

	return children;
};

AuthGuard.propTypes = {
	children: PropTypes.node,
	requiredUserType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default AuthGuard;
