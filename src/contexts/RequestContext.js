import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
	const [requests, setRequests] = useState([]);
	const [totalRequests, setTotalRequests] = useState(0);
	const [searchRequests, setSearchRequests] = useState([]);
	const [totalSearchRequests, setTotalSearchRequests] = useState(0);

	const resetRequestStates = () => {
		setRequests([]);
		setTotalRequests(0);
		setSearchRequests([]);
		setTotalSearchRequests(0);
	};

	return (
		<RequestContext.Provider value={{ requests, setRequests, totalRequests, setTotalRequests, searchRequests, setSearchRequests, totalSearchRequests, setTotalSearchRequests, resetRequestStates }}>
			{children}
		</RequestContext.Provider>
	);
};

RequestProvider.propTypes = {
	children: PropTypes.node,
};

export default RequestContext;
