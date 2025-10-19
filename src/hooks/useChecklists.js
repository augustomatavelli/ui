import UseAxios from "./useAxios";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import { useContext } from "react";
import ChecklistContext from "contexts/ChecklistContext";

const useChecklist = () => {
	const { publicAxios } = UseAxios();

	const { setLoadingChecklist, setChecklists, setTotalChecklists, setActiveChecklists } = useContext(ChecklistContext);

	const createChecklist = async (data) => {
		try {
			setLoadingChecklist(true);
			await publicAxios.post("/checklists", data);
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
			setLoadingChecklist(false);
		}
	};

	const findAllChecklists = async (search, page) => {
		try {
			setLoadingChecklist(true);
			const response = await publicAxios.get(`/checklists/admin/find-all?search=${search}&page=${page}`);
			setChecklists(response.data.items);
			setTotalChecklists(response.data.pagination.totalPages);
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
			setLoadingChecklist(false);
		}
	};

	const findAllActive = async () => {
		try {
			setLoadingChecklist(true);
			const response = await publicAxios.get("/checklists/admin/find-all/active");
			setActiveChecklists(response.data);
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
			setLoadingChecklist(false);
		}
	};

	const toggleStatus = async (checklistId) => {
		try {
			setLoadingChecklist(true);
			await publicAxios.patch(`/checklists/admin/status/${checklistId}`);
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
			setLoadingChecklist(false);
		}
	};

	return { findAllChecklists, toggleStatus, createChecklist, findAllActive };
};

export default useChecklist;
