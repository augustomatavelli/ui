import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext, { setSession } from "contexts/AuthContext";
import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import HelicopterContext from "contexts/HelicopterContext";
import UserContext from "contexts/UserContext";
import { LOGIN, LOGOUT } from "store/reducers/actions";

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
	const { authAxios } = UseAxios();

	const { user, setUser, resetUserStates } = useContext(UserContext);
	const { resetHelicopterStates } = useContext(HelicopterContext);
	const { dispatch } = useContext(AuthContext);

	const navigate = useNavigate();

	const login = async (data) => {
		try {
			const response = await authAxios.post("/auth/login", data);
			const { token, name, userType, userId, userStatus } = response.data;
			setSession(token);
			dispatch({
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
				navigate("/helicopters/me");
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

	const createUser = async (data) => {
		try {
			const response = await authAxios.post("/users", data);
			const { token, userType, userId, userStatus } = response.data;
			setSession(token);
			localStorage.setItem("_userId", userId);
			localStorage.setItem("_type", userType);
			localStorage.setItem("_status", userStatus);
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
		resetHelicopterStates();
		dispatch({
			type: LOGOUT,
			payload: {
				isLoggedIn: false,
			},
		});
		setTimeout(() => {
			navigate("/login");
		}, 1000);
	};

	return { login, createUser, logout };
};

export default useAuth;
