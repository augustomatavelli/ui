import UseAxios from "./useAxios";
import { useContext } from "react";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import TaskContext from "contexts/TaskContext";

const useTask = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingTask, setTasks, setTotalTasks } = useContext(TaskContext);

	const findAllTasks = async (search, page) => {
		try {
			setLoadingTask(true);
			const response = await publicAxios.get(`/tasks/find-all?search=${search}&page=${page}`);
			setTasks(response.data.items);
			setTotalTasks(response.data.pagination.totalPages);
			return response.data;
		} catch (error) {
			console.log(error);
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err],
					variant: "alert",
					alert: {
						color: "error",
					},
					close: true,
				})
			);
		} finally {
			setLoadingTask(false);
		}
	};

	return { findAllTasks };
};

export default useTask;
