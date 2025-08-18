import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const LogContext = createContext({});

export const LogProvider = ({ children }) => {
	const [loadingLog, setLoadingLog] = useState(false);
	const [logs, setLogs] = useState([]);
	const [totalLogs, setTotalLogs] = useState(0);

	const resetLogsStates = () => {
		setLoadingLog(false);
		setLogs([]);
		setTotalLogs(0);
	};

	return (
		<LogContext.Provider
			value={{
				loadingLog,
				setLoadingLog,
				logs,
				setLogs,
				totalLogs,
				setTotalLogs,
				resetLogsStates,
			}}
		>
			{children}
		</LogContext.Provider>
	);
};

LogProvider.propTypes = {
	children: PropTypes.node,
};

export default LogContext;
