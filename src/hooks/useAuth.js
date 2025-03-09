import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "contexts/AuthContext";
import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
	const { authAxios } = UseAxios();
	const navigate = useNavigate();
	const { setUser, setSession } = useContext(AuthContext);

	const login = async (data) => {
		try {
			const response = await authAxios.post("/auth/login", data);
			const { token, name, userType, userStatus } = response.data;
			setSession(token);
			localStorage.setItem("type", userType);
			localStorage.setItem("status", userStatus);
			setUser({ name: name });
			setTimeout(() => {
				navigate("/dashboard");
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
					close: false,
				})
			);
		}
	};

	const createUser = async (data) => {
		try {
			const response = await authAxios.post("/users", data);
			const { token, userType, userStatus } = response.data;
			setSession(token);
			localStorage.setItem("type", userType);
			localStorage.setItem("status", userStatus);
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
					close: false,
				})
			);
		}
	};

	const logout = () => {
		setSession(null);
		localStorage.clear();
		navigate(`/login`, {
			state: {
				from: "",
			},
		});
	};
	return { login, createUser, logout };
};

export default useAuth;
