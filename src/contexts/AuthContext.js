import PropTypes from "prop-types";
import { createContext, useEffect, useReducer, useContext } from "react";
import { LOGIN, LOGOUT } from "store/reducers/actions";
import Loader from "components/Loader";
import authReducer from "store/reducers/auth";
import axios from "utils/axios";
import { setCookie, destroyCookie } from "nookies";
import jwtDecode from "jwt-decode";
import UserContext from "./UserContext";

// constant
const initialState = {
	isLoggedIn: false,
	isInitialized: false,
	user: null,
};

const verifyToken = (sessionToken) => {
	if (!sessionToken) {
		return false;
	}
	const decoded = jwtDecode(sessionToken);
	/**
	 * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
	 */
	return decoded.exp > Date.now() / 1000;
};

export const setSession = (sessionToken) => {
	if (sessionToken) {
		localStorage.setItem("sessionToken", sessionToken);
		axios.defaults.headers.common.Authorization = `Bearer ${sessionToken}`;
		setCookie(null, "sessionToken", sessionToken, {
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

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const { user } = useContext(UserContext);

	const [state, dispatch] = useReducer(authReducer, initialState);

	useEffect(() => {
		const init = async () => {
			try {
				const sessionToken = window.localStorage.getItem("sessionToken");
				if (sessionToken && verifyToken(sessionToken)) {
					setSession(sessionToken);
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
						payload: {
							isLoggedIn: false,
						},
					});
				}
			} catch (err) {
				console.error(err);
				dispatch({
					type: LOGOUT,
					payload: {
						isLoggedIn: false,
					},
				});
			}
		};

		init();
	}, [user]);

	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	const resetAuthState = () => {};

	return <AuthContext.Provider value={{ ...state, dispatch, resetAuthState }}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthContext;
