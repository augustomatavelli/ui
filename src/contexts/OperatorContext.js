import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const OperatorContext = createContext({});

export const OperatorProvider = ({ children }) => {
	const [loadingOperator, setLoadingOperator] = useState(false);
	const [operators, setOperators] = useState([]);
	const [totalOperators, setTotalOperators] = useState(0);
	const [operatorDetails, setOperatorDetails] = useState({});
	const [searchOperator, setSearchOperator] = useState([]);

	const resetOperatorStates = useCallback(() => {
		setLoadingOperator(false);
		setOperators([]);
		setTotalOperators(0);
		setOperatorDetails({});
		setSearchOperator([]);
	}, []);

	const contextValue = useMemo(
		() => ({
			loadingOperator, setLoadingOperator,
			operators, setOperators,
			totalOperators, setTotalOperators,
			operatorDetails, setOperatorDetails,
			searchOperator, setSearchOperator,
			resetOperatorStates,
		}),
		[loadingOperator, operators, totalOperators, operatorDetails, searchOperator, resetOperatorStates]
	);

	return <OperatorContext.Provider value={contextValue}>{children}</OperatorContext.Provider>;
};

OperatorProvider.propTypes = {
	children: PropTypes.node,
};

export default OperatorContext;
