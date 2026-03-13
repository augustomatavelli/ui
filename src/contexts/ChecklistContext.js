import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useState } from "react";

export const ChecklistContext = createContext({});

export const ChecklistProvider = ({ children }) => {
const [loadingChecklist, setLoadingChecklist] = useState(false);
const [checklists, setChecklists] = useState([]);
const [totalChecklists, setTotalChecklists] = useState(0);
const [activeChecklists, setActiveChecklists] = useState([]);

const resetLogsStates = useCallback(() => {
setLoadingChecklist(false);
setChecklists([]);
setTotalChecklists(0);
setActiveChecklists([]);
}, []);

const contextValue = useMemo(
() => ({
loadingChecklist, setLoadingChecklist,
checklists, setChecklists,
totalChecklists, setTotalChecklists,
activeChecklists, setActiveChecklists,
resetLogsStates,
}),
[loadingChecklist, checklists, totalChecklists, activeChecklists, resetLogsStates]
);

return <ChecklistContext.Provider value={contextValue}>{children}</ChecklistContext.Provider>;
};

ChecklistProvider.propTypes = {
children: PropTypes.node,
};

export default ChecklistContext;
