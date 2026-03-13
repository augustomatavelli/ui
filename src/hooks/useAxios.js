"use client";

import { destroyCookie, parseCookies } from "nookies";
import axios from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router";

// Instancias criadas uma unica vez no modulo
const publicAxios = axios.create({ baseURL: process.env.REACT_APP_API_URL });

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
		if (error?.response?.status === 401 || error?.response?.status === 403) {
			localStorage.clear();
			destroyCookie(null, "sessionToken", { path: "/" });
			window.location.href = "/";
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
