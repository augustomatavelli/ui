import UseAxios from "./useAxios";
import { useContext } from "react";
import RequestContext from "contexts/RequestContext";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

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
		try {
			setLoadingRequest(true);
			const response = await publicAxios.post("/requests", data);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const searchAllRequests = async (search, page, statusParams, period, dateFilter) => {
		const { startDate, endDate } = dateFilter;

		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`);
			setSearchRequests(response.data.items);
			setTotalSearchRequests(response.data.pagination.totalPages);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const searchMyAircraftsRequests = async (search, page, statusParams, period, dateFilter) => {
		const { startDate, endDate } = dateFilter;

		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests/aircrafts/me?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`);
			setSearchAircraftsRequests(response.data.items);
			setTotalSearchAircraftsRequests(response.data.pagination.totalPages);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const updateRequest = async (requestId, data) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.patch(`/requests?requestId=${requestId}`, data);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const findAllLiveRequests = async (search, page) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests/dashboard/live`);
			setLiveRequests(response.data);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const findRequestsControl = async (search, page) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests/find-all/flight-operations?search=${search}&page=${page}`);
			setTotalRequests(response.data.pagination.totalPages);
			setRequestsControl(response.data.items);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const findAllRequests = async (search, page, statusParams, period, dateFilter) => {
		const { startDate, endDate } = dateFilter;

		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests/admin/find-all?search=${search}&page=${page}&${statusParams.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`);
			setRequests(response.data.items);
			setTotalRequests(response.data.pagination.totalPages);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const updateStatus = async (requestId) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.patch(`/requests/admin/update-status/${requestId}`);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const findSummaryPdf = async (requestId) => {
		try {
			setLoadingRequest(true);

			const response = await publicAxios.get(`/requests/admin/find-pdf/${requestId}`, {
				responseType: "blob",
			});
			const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `solicitacao-#${requestId}.pdf`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.log(error);
			const err = error?.response?.data?.errors?.[0]?.type || error?.response?.data?.errors?.[0]?.message || "Ocorreu um erro";

			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const findOneRequestById = async (requestId) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.get(`/requests/details/${requestId}`);
			setRequestDetails(response.data);
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const deleteRequest = async (requestId) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.delete(`/requests/${requestId}`);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	const updateRequestsControl = async (requestId, type) => {
		try {
			setLoadingRequest(true);
			const response = await publicAxios.patch(`/requests/${requestId}/flight-operations?type=${type}`);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingRequest(false);
		}
	};

	return {
		createRequest,
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
	};
};

export default useRequest;
