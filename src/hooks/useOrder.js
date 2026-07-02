import UseAxios from "./useAxios";
import { useContext } from "react";
import OrderContext from "contexts/OrdersContext";
import { runRequest } from "utils/api/runRequest";

const useOrder = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOrder, setOrders, setTotalOrders, setTotalTabOrders } = useContext(OrderContext);

	const findAllOrders = async (search, page, params, paramsStatus, period, dateFilter, signal) => {
		const { startDate, endDate } = dateFilter;

		const { data } = await runRequest(
			() => publicAxios.get(`/orders/find-all?search=${search}&page=${page}&${params.toString()}&${paramsStatus.toString()}&period=${period}&startDate=${startDate}&endDate=${endDate}`, { signal }),
			{ setLoading: setLoadingOrder },
		);
		if (data) {
			setOrders(data.items ?? []);
			setTotalOrders(data.pagination?.totalPages ?? 0);
			setTotalTabOrders(data.count);
		}
		return data;
	};

	const findAllCategories = async (signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/orders/categories`, { signal }), { setLoading: setLoadingOrder });
		return data;
	};

	const updateOrderStatus = async (orderId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/orders/update-status/${orderId}`, data), { setLoading: setLoadingOrder });
		return result;
	};

	return { findAllOrders, findAllCategories, updateOrderStatus };
};

export default useOrder;
