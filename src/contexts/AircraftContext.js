import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AircraftContext = createContext({});

export const AircraftProvider = ({ children }) => {
	const [loadingAircraft, setLoadingAircraft] = useState(false);
	const [searchAircrafts, setSearchAircrafts] = useState([]);
	const [totalSearchAircrafts, setTotalSearchAircrafts] = useState(0);
	const [aircraftDetails, setAircraftDetails] = useState({});
	const [searchUserAircraftLink, setUserAircraftLink] = useState("");
	const [aircrafts, setAircrafts] = useState([]);
	const [totalAircrafts, setTotalAircrafts] = useState(0);
	const [requestAircraft, setRequestAircraft] = useState({});
	const [anacResponse, setAnacRespose] = useState({});

	const resetAircraftstates = () => {
		setLoadingAircraft(false);
		setSearchAircrafts([]);
		setAircraftDetails({});
		setUserAircraftLink("");
		setAircrafts([]);
		setTotalAircrafts(0);
		setTotalSearchAircrafts(0);
		setRequestAircraft({});
		setAnacRespose({});
	};

	return (
		<AircraftContext.Provider
			value={{
				loadingAircraft,
				setLoadingAircraft,
				searchAircrafts,
				setSearchAircrafts,
				aircraftDetails,
				setAircraftDetails,
				searchUserAircraftLink,
				setUserAircraftLink,
				aircrafts,
				setAircrafts,
				totalAircrafts,
				setTotalAircrafts,
				totalSearchAircrafts,
				setTotalSearchAircrafts,
				resetAircraftstates,
				requestAircraft,
				setRequestAircraft,
				anacResponse,
				setAnacRespose,
			}}
		>
			{children}
		</AircraftContext.Provider>
	);
};

AircraftProvider.propTypes = {
	children: PropTypes.node,
};

export default AircraftContext;
