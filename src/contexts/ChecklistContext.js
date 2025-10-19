import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const ChecklistContext = createContext({});

export const ChecklistProvider = ({ children }) => {
	const [loadingChecklist, setLoadingChecklist] = useState(false);
	const [checklists, setChecklists] = useState([]);
	const [totalChecklists, setTotalChecklists] = useState(0);
	const [activeChecklists, setActiveChecklists] = useState([]);

	const resetLogsStates = () => {
		setLoadingChecklist(false);
		setChecklists([]);
		setTotalChecklists(0);
		setActiveChecklists([]);
	};

	return (
		<ChecklistContext.Provider
			value={{
				loadingChecklist,
				setLoadingChecklist,
				checklists,
				setChecklists,
				totalChecklists,
				setTotalChecklists,
				activeChecklists,
				setActiveChecklists,
				resetLogsStates,
			}}
		>
			{children}
		</ChecklistContext.Provider>
	);
};

ChecklistProvider.propTypes = {
	children: PropTypes.node,
};

export default ChecklistContext;
