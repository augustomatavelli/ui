import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const TaskContext = createContext({});

export const TaskProvider = ({ children }) => {
	const [loadingTask, setLoadingTask] = useState(false);
	const [tasks, setTasks] = useState([]);
	const [totalTasks, setTotalTasks] = useState(0);

	const resetTaskStates = () => {
		setLoadingTask(false);
		setTasks([]);
		setTotalTasks(0);
	};

	return <TaskContext.Provider value={{ loadingTask, setLoadingTask, tasks, setTasks, totalTasks, setTotalTasks, resetTaskStates }}>{children}</TaskContext.Provider>;
};

TaskProvider.propTypes = {
	children: PropTypes.node,
};

export default TaskContext;
