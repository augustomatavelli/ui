import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
	const [requests, setRequests] = useState([]);
	const [totalRequests, setTotalRequests] = useState(0);
	const [searchRequests, setSearchRequests] = useState([]);
	const [totalSearchRequests, setTotalSearchRequests] = useState(0);
	const [searchAircraftsRequests, setSearchAircraftsRequests] = useState([]);
	const [totalSearchAircraftsRequests, setTotalSearchAircraftsRequests] = useState(0);
	const [requestResume, setRequestResume] = useState({});

	const resetRequestStates = () => {
		setRequests([]);
		setTotalRequests(0);
		setSearchRequests([]);
		setTotalSearchRequests(0);
		setSearchAircraftsRequests([]);
		setTotalSearchAircraftsRequests(0);
		setRequestResume({});
	};

	return (
		<RequestContext.Provider
			value={{
				requests,
				setRequests,
				totalRequests,
				setTotalRequests,
				searchRequests,
				setSearchRequests,
				totalSearchRequests,
				setTotalSearchRequests,
				searchAircraftsRequests,
				setSearchAircraftsRequests,
				totalSearchAircraftsRequests,
				setTotalSearchAircraftsRequests,
				requestResume,
				setRequestResume,
				resetRequestStates,
			}}
		>
			{children}
		</RequestContext.Provider>
	);
};

RequestProvider.propTypes = {
	children: PropTypes.node,
};

export default RequestContext;
