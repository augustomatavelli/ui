import axios from "axios";
const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || "http://localhost:3010/" });

axiosServices.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			window.location = "/";
		}
		return Promise.reject((error.response && error.response.data) || "Wrong Services");
	}
);

export default axiosServices;
