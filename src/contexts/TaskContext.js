import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
	const [loadingOrder, setLoadingOrder] = useState(false);
	const [orders, setOrders] = useState([]);
	const [totalOrders, setTotalOrders] = useState(0);

	const resetOrderStates = () => {
		setLoadingOrder(false);
		setOrders([]);
		setTotalOrders(0);
	};

	return <OrderContext.Provider value={{ loadingOrder, setLoadingOrder, orders, setOrders, totalOrders, setTotalOrders, resetOrderStates }}>{children}</OrderContext.Provider>;
};

OrderProvider.propTypes = {
	children: PropTypes.node,
};

export default OrderContext;
