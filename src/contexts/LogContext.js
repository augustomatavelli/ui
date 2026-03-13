import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const LogContext = createContext({});

export const LogProvider = ({ children }) => {
	const [loadingLog, setLoadingLog] = useState(false);
	const [logs, setLogs] = useState([]);
	const [totalLogs, setTotalLogs] = useState(0);

	const resetLogsStates = useCallback(() => {
		setLoadingLog(false);
		setLogs([]);
		setTotalLogs(0);
	}, []);

	const contextValue = useMemo(
		() => ({ loadingLog, setLoadingLog, logs, setLogs, totalLogs, setTotalLogs, resetLogsStates }),
		[loadingLog, logs, totalLogs, resetLogsStates]
	);

	return <LogContext.Provider value={contextValue}>{children}</LogContext.Provider>;
};

LogProvider.propTypes = {
	children: PropTypes.node,
};

export default LogContext;
