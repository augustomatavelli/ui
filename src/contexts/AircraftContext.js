import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const AircraftContext = createContext({});

export const AircraftProvider = ({ children }) => {
        const [loadingAircraft, setLoadingAircraft] = useState(false);
        const [searchAircrafts, setSearchAircrafts] = useState([]);
        const [totalSearchAircrafts, setTotalSearchAircrafts] = useState(0);
        const [aircraftDetails, setAircraftDetails] = useState({});
        const [searchUserAircraftLink, setUserAircraftLink] = useState("");
        const [searchOperatorAircraftLink, setSearchOperatorAircraftLink] = useState("");
        const [aircrafts, setAircrafts] = useState([]);
        const [totalAircrafts, setTotalAircrafts] = useState(0);
        const [requestAircraft, setRequestAircraft] = useState({});
        const [anacResponse, setAnacResponse] = useState({});

        const resetAircraftstates = useCallback(() => {
                setLoadingAircraft(false);
                setSearchAircrafts([]);
                setAircraftDetails({});
                setUserAircraftLink("");
                setAircrafts([]);
                setTotalAircrafts(0);
                setTotalSearchAircrafts(0);
                setRequestAircraft({});
                setSearchOperatorAircraftLink("");
        }, []);

        const contextValue = useMemo(
                () => ({ loadingAircraft, setLoadingAircraft, searchAircrafts, setSearchAircrafts, aircraftDetails, setAircraftDetails, searchUserAircraftLink, setUserAircraftLink, aircrafts, setAircrafts, totalAircrafts, setTotalAircrafts, totalSearchAircrafts, setTotalSearchAircrafts, resetAircraftstates, requestAircraft, setRequestAircraft, searchOperatorAircraftLink, setSearchOperatorAircraftLink, anacResponse, setAnacResponse }),
                [loadingAircraft, searchAircrafts, aircraftDetails, searchUserAircraftLink, aircrafts, totalAircrafts, totalSearchAircrafts, resetAircraftstates, requestAircraft, searchOperatorAircraftLink, anacResponse]
        );

        return <AircraftContext.Provider value={contextValue}>{children}</AircraftContext.Provider>;
};

AircraftProvider.propTypes = {
	children: PropTypes.node,
};

export default AircraftContext;
