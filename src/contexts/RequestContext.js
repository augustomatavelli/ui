import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const RequestContext = createContext({});

export const RequestProvider = ({ children }) => {
	const [loadingRequest, setLoadingRequest] = useState(false);
	const [requests, setRequests] = useState([]);
	const [totalRequests, setTotalRequests] = useState(0);
	const [searchRequests, setSearchRequests] = useState([]);
	const [totalSearchRequests, setTotalSearchRequests] = useState(0);
	const [searchAircraftsRequests, setSearchAircraftsRequests] = useState([]);
	const [totalSearchAircraftsRequests, setTotalSearchAircraftsRequests] = useState(0);
	const [requestResume, setRequestResume] = useState({ products: [], services: [] });
	const [requestDetails, setRequestDetails] = useState({});
	const [liveRequests, setLiveRequests] = useState([]);

	const resetRequestStates = () => {
		setLoadingRequest(false);
		setRequests([]);
		setTotalRequests(0);
		setSearchRequests([]);
		setTotalSearchRequests(0);
		setSearchAircraftsRequests([]);
		setTotalSearchAircraftsRequests(0);
		setRequestResume({ products: [], services: [] });
		setRequestDetails({});
		setLiveRequests([]);
	};

	return (
		<RequestContext.Provider
			value={{
				loadingRequest,
				setLoadingRequest,
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
				requestDetails,
				setRequestDetails,
				liveRequests,
				setLiveRequests,
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
