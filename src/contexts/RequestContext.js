import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
	const [requests, setRequests] = useState([]);

	const resetRequestStates = () => {};

	return <RequestContext.Provider value={{ requests, setRequests, resetRequestStates }}>{children}</RequestContext.Provider>;
};

RequestProvider.propTypes = {
	children: PropTypes.node,
};

export default RequestContext;
