import UserContext from "contexts/UserContext";
import useTask from "hooks/useTask";
import { useNavigate } from "react-router";
import TaskCard from "./TaskCard";
import { useState, useEffect, useContext } from "react";

// material-ui
import { Grid, Stack, useMediaQuery, Box, Pagination } from "@mui/material";

// project import
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

import Loader from "components/Loader";
import TaskContext from "contexts/TaskContext";
import SearchTask from "sections/apps/tasks/SearchTask";

const ListTasks = () => {
	const { user } = useContext(UserContext);
	const { findAllTasks } = useTask();

	const { tasks, totalTasks, loadingTask } = useContext(TaskContext);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "C") {
			navigate("/aircrafts/me", { replace: true });
		}
	}, []);

	useEffect(() => {
		findAllTasks(search, page);
	}, [search, page]);

	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	return (
		<>
			<Box sx={{ position: "relative", marginBottom: 3 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchTask setSearch={setSearch} />
					</Stack>
				</Stack>
			</Box>
			{loadingTask ? (
				<Loader />
			) : tasks.length > 0 ? (
				<Grid container spacing={2}>
					{tasks.map((task) => (
						<Grid item key={task.id_request} xs={12} sm={12} md={6}>
							<TaskCard data={task} />
						</Grid>
					))}
				</Grid>
			) : (
				<Grid container>
					<EmptyUserCard title={"Não há nenhuma tarefa pendente."} />
				</Grid>
			)}
			<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
				<Pagination count={totalTasks} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
			</Stack>
		</>
	);
};

export default ListTasks;
