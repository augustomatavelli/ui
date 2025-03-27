import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const OperationsContext = createContext({});

export const OperationsProvider = ({ children }) => {
	const [loadingOperation, setLoadingOperation] = useState(false);
	const [operations, setOperations] = useState([]);
	const [totalOperations, setTotalOperations] = useState(0);
	const [searchOperations, setSearchOperations] = useState([]);
	const [categories, setCategories] = useState([]);

	const resetOperationStates = () => {
		setLoadingOperation(false);
		setOperations([]);
		setTotalOperations(0);
		setSearchOperations([]);
		setCategories([]);
	};

	return (
		<OperationsContext.Provider
			value={{
				loadingOperation,
				setLoadingOperation,
				operations,
				setOperations,
				totalOperations,
				setTotalOperations,
				searchOperations,
				setSearchOperations,
				categories,
				setCategories,
				resetOperationStates,
			}}
		>
			{children}
		</OperationsContext.Provider>
	);
};

OperationsProvider.propTypes = {
	children: PropTypes.node,
};

export default OperationsContext;
