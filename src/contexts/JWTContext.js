import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useState } from "react";

// third-party
import { Chance } from "chance";
import jwtDecode from "jwt-decode";

// reducer - state management
import { LOGIN, LOGOUT } from "store/reducers/actions";
import authReducer from "store/reducers/auth";

// project import
import Loader from "components/Loader";
import axios from "utils/axios";
import UseAxios from "../hooks/useAxios";
import { setCookie, destroyCookie } from "nookies";

const chance = new Chance();

// constant
const initialState = {
	isLoggedIn: false,
	isInitialized: false,
	user: null,
};

const verifyToken = (serviceToken) => {
	if (!serviceToken) {
		return false;
	}
	const decoded = jwtDecode(serviceToken);
	/**
	 * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
	 */
	return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
	if (serviceToken) {
		localStorage.setItem("sessionToken", serviceToken);
		axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
		setCookie(null, "sessionToken", serviceToken, {
			maxAge: 60 * 60 * 24 * 7,
			path: "/",
			secure: true,
			sameSite: "Strict",
		});
	} else {
		localStorage.removeItem("sessionToken");
		delete axios.defaults.headers.common.Authorization;
		destroyCookie(null, "sessionToken");
	}
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
	const { authAxios } = UseAxios();

	const [state, dispatch] = useReducer(authReducer, initialState);
	const [user, setUser] = useState({});

	useEffect(() => {
		const init = async () => {
			try {
				const serviceToken = window.localStorage.getItem("serviceToken");
				if (serviceToken && verifyToken(serviceToken)) {
					setSession(serviceToken);
					const response = await axios.get("/api/account/me");
					const { user } = response.data;
					dispatch({
						type: LOGIN,
						payload: {
							isLoggedIn: true,
							user,
						},
					});
				} else {
					dispatch({
						type: LOGOUT,
					});
				}
			} catch (err) {
				console.error(err);
				dispatch({
					type: LOGOUT,
				});
			}
		};

		init();
	}, []);

	const login = async (data) => {
		const response = await authAxios.post("/auth/login", data);
		const { token, userId, name } = response.data;
		setSession(token);
		setUser({ name: name });
		dispatch({
			type: LOGIN,
			payload: {
				isLoggedIn: true,
				userId,
			},
		});
	};

	const register = async (data) => {
		const response = await authAxios.post("/users", data);
		const { token, userId } = response.data;
		setSession(token);
		dispatch({
			type: LOGIN,
			payload: {
				isLoggedIn: true,
				userId,
			},
		});
	};

	const logout = () => {
		setSession(null);
		dispatch({ type: LOGOUT });
	};

	const resetPassword = async () => {};

	const updateProfile = () => {};

	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile, user }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
	children: PropTypes.node,
};

export default JWTContext;
