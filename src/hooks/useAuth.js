import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { setSession } from "contexts/AuthContext";
import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import AircraftContext from "contexts/AircraftContext";
import UserContext from "contexts/UserContext";
import { LOGIN, LOGOUT } from "store/reducers/actions";
import { dispatch } from "store";
import LandingSiteContext from "contexts/LandingSiteContext";
import OperationsContext from "contexts/OperationContext";
import ProductsContext from "contexts/ProductsContext";
import RequestContext from "contexts/RequestContext";

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
	const { authAxios } = UseAxios();

	const { resetAircraftstates } = useContext(AircraftContext);
	const { resetLandingSiteStates } = useContext(LandingSiteContext);
	const { resetOperationStates } = useContext(OperationsContext);
	const { resetProductStates } = useContext(ProductsContext);
	const { resetRequestStates } = useContext(RequestContext);
	const { user, setUser, resetUserStates } = useContext(UserContext);
	const { dispatchAuth } = useContext(AuthContext);

	const navigate = useNavigate();

	const login = async (data) => {
		try {
			const response = await authAxios.post("/auth/login", data);
			const { token, name, userType, userId, userStatus } = response.data;
			setSession(token);
			dispatchAuth({
				type: LOGIN,
				payload: {
					isLoggedIn: true,
					user,
				},
			});
			localStorage.setItem("_userId", userId);
			localStorage.setItem("_type", userType);
			localStorage.setItem("_status", userStatus);
			setUser({ name: name });
			setTimeout(() => {
				navigate("/aircrafts/me");
			}, 1000);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		}
	};

	const logout = () => {
		localStorage.clear();
		resetUserStates();
		resetAircraftstates();
		resetLandingSiteStates();
		resetOperationStates();
		resetProductStates();
		resetRequestStates();
		dispatchAuth({
			type: LOGOUT,
			payload: {
				isLoggedIn: false,
			},
		});
		navigate("/");
	};

	return { login, logout };
};

export default useAuth;
