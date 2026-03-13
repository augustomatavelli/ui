import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
	const [loadingOrder, setLoadingOrder] = useState(false);
	const [orders, setOrders] = useState([]);
	const [totalOrders, setTotalOrders] = useState(0);
	const [totalTabOrders, setTotalTabOrders] = useState(0);

	const resetOrderStates = useCallback(() => {
		setLoadingOrder(false);
		setOrders([]);
		setTotalOrders(0);
		setTotalTabOrders(0);
	}, []);

	const contextValue = useMemo(
		() => ({ loadingOrder, setLoadingOrder, orders, setOrders, totalOrders, setTotalOrders, totalTabOrders, setTotalTabOrders, resetOrderStates }),
		[loadingOrder, orders, totalOrders, totalTabOrders, resetOrderStates]
	);

	return <OrderContext.Provider value={contextValue}>{children}</OrderContext.Provider>;
};

OrderProvider.propTypes = {
	children: PropTypes.node,
};

export default OrderContext;
