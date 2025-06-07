import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const OperatorContext = createContext({});

export const OperatorProvider = ({ children }) => {
	const [loadingOperator, setLoadingOperator] = useState(false);
	const [operators, setOperators] = useState([]);
	const [totalOperators, setTotalOperators] = useState(0);
	const [operatorDetails, setOperatorDetails] = useState({});
	const [searchOperator, setSearchOperator] = useState([]);

	const resetOperatorStates = () => {
		setLoadingOperator(false);
		setOperators([]);
		setTotalOperators(0);
		setOperatorDetails({});
		setSearchOperator([]);
	};

	return (
		<OperatorContext.Provider
			value={{
				loadingOperator,
				setLoadingOperator,
				operators,
				setOperators,
				totalOperators,
				setTotalOperators,
				operatorDetails,
				setOperatorDetails,
				resetOperatorStates,
				searchOperator,
				setSearchOperator,
			}}
		>
			{children}
		</OperatorContext.Provider>
	);
};

OperatorProvider.propTypes = {
	children: PropTypes.node,
};

export default OperatorContext;
