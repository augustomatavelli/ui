"use client";

import { destroyCookie } from "nookies";
import { parseCookies } from "nookies";
import axios from "axios";

const UseAxios = () => {
	const authAxios = axios.create({ baseURL: process.env.REACT_APP_API_URL });
	const publicAxios = axios.create({ baseURL: process.env.REACT_APP_API_URL });

	const insertAuthorization = async (config) => {
		const cookies = parseCookies();
		const token = cookies["sessionToken"];

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		} else {
			logout();
		}

		return config;
	};

	const logout = async () => {
		localStorage.clear();
		destroyCookie(null, "sessionToken", {
			path: "/",
		});
	};

	const invalidAuthorization = async (error) => {
		if (error?.response?.status == 401) {
			logout();
		}

		return Promise.reject(error);
	};

	authAxios.interceptors.request.use(insertAuthorization, (error) => Promise.reject(error));
	authAxios.interceptors.response.use((response) => response, invalidAuthorization);
	publicAxios.interceptors.request.use(insertAuthorization, (error) => Promise.reject(error));
	publicAxios.interceptors.response.use((response) => response, invalidAuthorization);

	return { authAxios, logout, publicAxios };
};

export default UseAxios;
