import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// auth provider
import AuthContext from "contexts/AuthContext";
import UseAxios from "./useAxios";

// import AuthContext from 'contexts/FirebaseContext';
// import AuthContext from 'contexts/AWSCognitoContext';
// import AuthContext from 'contexts/Auth0Context';

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
	const { authAxios } = UseAxios();
	const navigate = useNavigate();
	const { setUser, setSession } = useContext(AuthContext);

	const login = async (data) => {
		const response = await authAxios.post("/auth/login", data);
		const { token, name, userType, userStatus } = response.data;
		setSession(token);
		localStorage.setItem("type", userType);
		localStorage.setItem("status", userStatus);
		setUser({ name: name });
		setTimeout(() => {
			navigate("/dashboard");
		}, 2000);
	};

	const register = async (data) => {
		const response = await authAxios.post("/users", data);
		const { token, userType, userStatus } = response.data;
		setSession(token);
		localStorage.setItem("type", userType);
		localStorage.setItem("status", userStatus);
	};

	const logout = () => {
		setSession(null);
	};
	return { login, register, logout };
};

export default useAuth;
