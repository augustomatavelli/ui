import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const OperationsContext = createContext({});

export const OperationsProvider = ({ children }) => {
	const [loadingOperation, setLoadingOperation] = useState(false);
	const [operations, setOperations] = useState([]);
	const [totalOperations, setTotalOperations] = useState(0);
	const [searchOperations, setSearchOperations] = useState([]);
	const [categories, setCategories] = useState([]);
	const [operationDetails, setOperationDetails] = useState({});
	const [icons, setIcons] = useState([]);

	const resetOperationStates = useCallback(() => {
		setLoadingOperation(false);
		setOperations([]);
		setTotalOperations(0);
		setSearchOperations([]);
		setCategories([]);
		setOperationDetails({});
		setIcons([]);
	}, []);

	const contextValue = useMemo(
		() => ({
			loadingOperation, setLoadingOperation,
			operations, setOperations,
			totalOperations, setTotalOperations,
			searchOperations, setSearchOperations,
			categories, setCategories,
			operationDetails, setOperationDetails,
			icons, setIcons,
			resetOperationStates,
		}),
		[loadingOperation, operations, totalOperations, searchOperations, categories, operationDetails, icons, resetOperationStates]
	);

	return <OperationsContext.Provider value={contextValue}>{children}</OperationsContext.Provider>;
};

OperationsProvider.propTypes = {
	children: PropTypes.node,
};

export default OperationsContext;
