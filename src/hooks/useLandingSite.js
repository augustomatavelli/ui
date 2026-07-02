import UseAxios from "./useAxios";
import { useContext } from "react";
import LandingSiteContext from "contexts/LandingSiteContext";
import { runRequest } from "utils/api/runRequest";

const useLandingSite = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingLandingSite, setLandingSites, setTotalLandingSites, setSearchLandingSites, setUf, setLandingSiteDetails } = useContext(LandingSiteContext);

	const createLandingSite = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/landing-sites", data), { setLoading: setLoadingLandingSite });
		return result;
	};

	const searchAllLandingSites = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/landing-sites`, { signal }), { setLoading: setLoadingLandingSite });
		if (data) {
			setSearchLandingSites(data);
		}
	};

	const findAllLandingSites = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/landing-sites/admin/find-all?search=${search}&page=${page}`, { signal }), { setLoading: setLoadingLandingSite });
		if (data) {
			setLandingSites(data.items ?? []);
			setTotalLandingSites(data.pagination?.totalPages ?? 0);
		}
	};

	const findUf = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/landing-sites/uf`, { signal }), { setLoading: setLoadingLandingSite });
		if (data) {
			setUf(data);
		}
	};

	const findOneLandingSiteById = async (userId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/landing-sites/${userId}`, { signal }), { setLoading: setLoadingLandingSite });
		if (data) {
			setLandingSiteDetails(data);
		}
	};

	const deleteLandingSite = async (landingSiteId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/landing-sites/admin/delete/${landingSiteId}`), { setLoading: setLoadingLandingSite });
		return data;
	};

	return { createLandingSite, findAllLandingSites, searchAllLandingSites, findUf, findOneLandingSiteById, deleteLandingSite };
};

export default useLandingSite;
