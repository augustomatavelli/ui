import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AircraftContext = createContext({});

export const AircraftProvider = ({ children }) => {
	const [aircrafts, setAircrafts] = useState([]);
	const [aircraftDetails, setAircraftDetails] = useState({});

	const resetAircraftstates = () => {
		setAircrafts([]);
		setAircraftDetails({});
	};

	return <AircraftContext.Provider value={{ aircrafts, setAircrafts, aircraftDetails, setAircraftDetails, resetAircraftstates }}>{children}</AircraftContext.Provider>;
};

AircraftProvider.propTypes = {
	children: PropTypes.node,
};

export default AircraftContext;
