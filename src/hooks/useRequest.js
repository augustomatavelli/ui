import UseAxios from "./useAxios";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";
import { runRequest } from "utils/api/runRequest";

const useRequest = () => {
	const { publicAxios } = UseAxios();

	const {
		setLoadingRequest,
		setRequests,
		setTotalRequests,
		setSearchRequests,
		setTotalSearchRequests,
		setSearchAircraftsRequests,
		setTotalSearchAircraftsRequests,
		setRequestDetails,
		setLiveRequests,
		setRequestsControl,
	} = useContext(RequestContext);

	const createRequest = async (data) => {
		const { data: result } = await runRequest(() => publicAxios.post("/requests", data), { setLoading: setLoadingRequest });
		return result;
	};

	const calculateResume = async ({ aircraftId, landing_date, takeoff_date, services, products }) => {
		const { data, error } = await runRequest(
			() =>
				publicAxios.post("/requests/calculate-resume", {
					aircraftId,
					landing_date: landing_date ?? null,
					takeoff_date: takeoff_date ?? null,
					services: (services || []).map((s) => ({ id_service: s.id_service, amount: String(s.amount) })),
					products: (products || []).map((p) => ({ id_product: p.id_product, amount: String(p.amount) })),
				}),
			{ notifyError: false },
		);
		if (error) return null;
		return data;
	};

	const searchAllRequests = async (search, page, statusParams, period, dateFilter, signal) => {
		const { startDate, endDate } = dateFilter;

		const { data } = await runRequest(
			() => publicAxios.get(`/requests?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`, { signal }),
			{ setLoading: setLoadingRequest },
		);
		if (data) {
			setSearchRequests(data.items ?? []);
			setTotalSearchRequests(data.pagination?.totalPages ?? 0);
		}
	};

	const searchMyAircraftsRequests = async (search, page, statusParams, period, dateFilter, signal) => {
		const { startDate, endDate } = dateFilter;

		const { data } = await runRequest(
			() => publicAxios.get(`/requests/aircrafts/me?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`, { signal }),
			{ setLoading: setLoadingRequest },
		);
		if (data) {
			setSearchAircraftsRequests(data.items ?? []);
			setTotalSearchAircraftsRequests(data.pagination?.totalPages ?? 0);
		}
	};

	const updateRequest = async (requestId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/requests?requestId=${requestId}`, data), { setLoading: setLoadingRequest });
		return result;
	};

	const findAllLiveRequests = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/requests/dashboard/live`, { signal }), { setLoading: setLoadingRequest });
		if (data) {
			setLiveRequests(data);
		}
	};

	const findRequestsControl = async (search, page, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/requests/find-all/flight-operations?search=${search}&page=${page}`, { signal }), { setLoading: setLoadingRequest });
		if (data) {
			setTotalRequests(data.pagination?.totalPages ?? 0);
			setRequestsControl(data.items ?? []);
		}
	};

	const findAllRequests = async (search, page, statusParams, period, dateFilter, signal) => {
		const { startDate, endDate } = dateFilter;

		const { data } = await runRequest(
			() => publicAxios.get(`/requests/admin/find-all?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`, { signal }),
			{ setLoading: setLoadingRequest },
		);
		if (data) {
			setRequests(data.items ?? []);
			setTotalRequests(data.pagination?.totalPages ?? 0);
		}
	};

	const updateStatus = async (requestId) => {
		const { data } = await runRequest(() => publicAxios.patch(`/requests/admin/update-status/${requestId}`), { setLoading: setLoadingRequest });
		return data;
	};

	const updateAbsence = async (requestId) => {
		const { data } = await runRequest(() => publicAxios.patch(`/requests/admin/update-absence/${requestId}`), { setLoading: setLoadingRequest });
		return data;
	};

	const findSummaryPdf = async (requestId) => {
		const { response } = await runRequest(() => publicAxios.get(`/requests/admin/find-pdf/${requestId}`, { responseType: "blob" }), { setLoading: setLoadingRequest });
		if (response) {
			const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `solicitacao-#${requestId}.pdf`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		}
	};

	const findOneRequestById = async (requestId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/requests/details/${requestId}`, { signal }), { setLoading: setLoadingRequest });
		if (data) {
			setRequestDetails(data);
		}
	};

	const deleteRequest = async (requestId) => {
		const { data } = await runRequest(() => publicAxios.delete(`/requests/${requestId}`), { setLoading: setLoadingRequest });
		return data;
	};

	const updateRequestsControl = async (requestId, type, date) => {
		const { data } = await runRequest(() => publicAxios.patch(`/requests/${requestId}/flight-operations?type=${type}&date=${date}`), { setLoading: setLoadingRequest });
		return data;
	};

	return {
		createRequest,
		calculateResume,
		findAllRequests,
		searchAllRequests,
		searchMyAircraftsRequests,
		updateStatus,
		findOneRequestById,
		updateRequest,
		findAllLiveRequests,
		deleteRequest,
		findSummaryPdf,
		findRequestsControl,
		updateRequestsControl,
		updateAbsence,
	};
};

export default useRequest;
