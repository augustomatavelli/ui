"use client";

import { destroyCookie, parseCookies } from "nookies";
import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

// Instancias criadas uma unica vez no modulo
const publicAxios = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Logout "duro" — usado fora do ciclo do React (interceptor). Limpa credenciais
// e redireciona para a tela inicial.
const forceLogout = () => {
	localStorage.clear();
	destroyCookie(null, "sessionToken", { path: "/" });
	window.location.href = "/";
};

publicAxios.interceptors.request.use(
	(config) => {
		const token = parseCookies()["sessionToken"];
		if (token) config.headers["Authorization"] = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

publicAxios.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;
		// 401 = sessão inválida/expirada -> desloga.
		if (status === 401) {
			forceLogout();
		} else if (status === 403) {
			// 403 = autenticado, mas sem permissão -> avisa e MANTÉM o usuário na página.
			dispatch(
				openSnackbar({
					open: true,
					message: "Você não possui permissão para esta ação.",
					variant: "alert",
					alert: { color: "error" },
					close: true,
				})
			);
		}
		return Promise.reject(error);
	}
);

const UseAxios = () => {
	const navigate = useNavigate();

	const logout = useCallback(() => {
		localStorage.clear();
		destroyCookie(null, "sessionToken", { path: "/" });
		navigate("/");
	}, [navigate]);

	return { publicAxios, logout };
};

export default UseAxios;
