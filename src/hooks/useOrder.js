import UseAxios from "./useAxios";
import { useContext } from "react";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import OrderContext from "contexts/OrdersContext";

const useOrder = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingOrder, setOrders, setTotalOrders, setTotalTabOrders } = useContext(OrderContext);

	const findAllOrders = async (search, page, params, paramsStatus) => {
		try {
			setLoadingOrder(true);
			const response = await publicAxios.get(`/orders/find-all?search=${search}&page=${page}&${params.toString()}&${paramsStatus.toString()}`);
			setOrders(response.data.items);
			setTotalOrders(response.data.pagination.totalPages);
			setTotalTabOrders(response.data.pagination.totalResults);
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
			setLoadingOrder(false);
		}
	};

	const findAllCategories = async () => {
		try {
			setLoadingOrder(true);
			const response = await publicAxios.get(`/orders/categories`);
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
			setLoadingOrder(false);
		}
	};

	const updateOrderStatus = async (orderId, data) => {
		try {
			setLoadingOrder(true);
			const response = await publicAxios.patch(`/orders/update-status/${orderId}`, data);
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
			setLoadingOrder(false);
		}
	};

	return { findAllOrders, findAllCategories, updateOrderStatus };
};

export default useOrder;
