import { useContext } from "react";

// auth provider
import AuthContext from "contexts/JWTContext";
// import AuthContext from 'contexts/FirebaseContext';
// import AuthContext from 'contexts/AWSCognitoContext';
// import AuthContext from 'contexts/Auth0Context';
import UseAxios from "./useAxios";

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
	const { authAxios } = UseAxios();

	const context = useContext(AuthContext);

	if (!context) throw new Error("context must be use inside provider");

	const register = async (data) => {
		try {
			const response = await authAxios.post("/users", data);
			console.log(response.data);
		} catch (error) {
			console.error("Erro no cadastro:", error);
			throw error;
		}
	};

	const login = async (data) => {
		try {
			const response = await authAxios.post("/auth/login", data);
			console.log(response.data);
		} catch (error) {
			console.error("Erro no cadastro:", error);
			throw error;
		}
	};

	return { ...context, register, login };
};

export default useAuth;
