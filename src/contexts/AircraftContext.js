import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AircraftContext = createContext({});

export const AircraftProvider = ({ children }) => {
	const [aircrafts, setAircrafts] = useState([]);
	const [aircraftDetails, setAircraftDetails] = useState({});
	const [searchUserAircraftLink, setUserAircraftLink] = useState("");
	const [aircraftsPending, setAircraftsPending] = useState([]);
	const [totalAircraftPending, setTotalAircraftPending] = useState(0);
	const [totalAircraft, setTotalAircraft] = useState(0);

	const resetAircraftstates = () => {
		setAircrafts([]);
		setAircraftDetails({});
		setUserAircraftLink("");
		setAircraftsPending([]);
		setTotalAircraftPending(0);
		setTotalAircraft(0);
	};

	return (
		<AircraftContext.Provider
			value={{
				aircrafts,
				setAircrafts,
				aircraftDetails,
				setAircraftDetails,
				searchUserAircraftLink,
				setUserAircraftLink,
				aircraftsPending,
				setAircraftsPending,
				totalAircraftPending,
				setTotalAircraftPending,
				totalAircraft,
				setTotalAircraft,
				resetAircraftstates,
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
