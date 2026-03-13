import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const InventoryContext = createContext({});

export const InventoryProvider = ({ children }) => {
	const [loadingInventory, setLoadingInventory] = useState(false);
	const [inventoryList, setInventoryList] = useState([]);
	const [inventory, setInventory] = useState([]);
	const [totalInventoryItems, setTotalInventoryItems] = useState(0);
	const [actualStock, setActualStock] = useState(0);
	const [stockHistory, setStockHistory] = useState([]);

	const resetInventoryStates = useCallback(() => {
		setLoadingInventory(false);
		setInventory([]);
		setInventoryList([]);
		setTotalInventoryItems(0);
		setActualStock(0);
		setStockHistory([]);
	}, []);

	const contextValue = useMemo(
		() => ({ loadingInventory, setLoadingInventory, inventory, setInventory, inventoryList, setInventoryList, totalInventoryItems, setTotalInventoryItems, actualStock, setActualStock, stockHistory, setStockHistory, resetInventoryStates }),
		[loadingInventory, inventory, inventoryList, totalInventoryItems, actualStock, stockHistory, resetInventoryStates]
	);

	return <InventoryContext.Provider value={contextValue}>{children}</InventoryContext.Provider>;
};

InventoryProvider.propTypes = {
	children: PropTypes.node,
};

export default InventoryContext;
