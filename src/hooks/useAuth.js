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

const useAuth = () => {
	const { authAxios, publicAxios } = UseAxios();

	const { resetAircraftstates } = useContext(AircraftContext);
	const { resetLandingSiteStates } = useContext(LandingSiteContext);
	const { resetOperationStates } = useContext(OperationsContext);
	const { resetProductStates } = useContext(ProductsContext);
	const { resetRequestStates } = useContext(RequestContext);
	const { user, resetUserStates } = useContext(UserContext);
	const { dispatchAuth, setLoadingResetPassword, setResetToken, setLoadingLogin } = useContext(AuthContext);

	const navigate = useNavigate();

	const login = async (data) => {
		try {
			setLoadingLogin(true);
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
			console.log(userType, typeof userType);
			userType === "C" ? navigate("/orders") : navigate("/aircrafts/me");

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
		} finally {
			setLoadingLogin(false);
		}
	};

	const requestResetPasswordCode = async (data) => {
		try {
			setLoadingResetPassword(true);
			const response = await publicAxios.post(`/auth/request-code`, data);
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
		} finally {
			setLoadingResetPassword(false);
		}
	};

	const checkResetPasswordCode = async (data) => {
		try {
			setLoadingResetPassword(true);
			const response = await publicAxios.post(`/auth/check-code`, data);
			setResetToken(response.data.token);
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
		} finally {
			setLoadingResetPassword(false);
		}
	};

	const resetPassword = async (data) => {
		try {
			setLoadingResetPassword(true);
			const response = await publicAxios.patch(`/auth/reset-password`, data);
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
		} finally {
			setLoadingResetPassword(false);
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

	return { login, logout, requestResetPasswordCode, checkResetPasswordCode, resetPassword };
};

export default useAuth;
