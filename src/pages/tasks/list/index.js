import UserContext from "contexts/UserContext";
import useTask from "hooks/useTask";
import { useNavigate } from "react-router";
import TaskCard from "./TaskCard";
import { useState, useEffect, useContext } from "react";

// material-ui
import { Grid, Stack, useMediaQuery, Button, Box, Dialog, Pagination } from "@mui/material";

// project import
import { PopupTransition } from "components/@extended/Transitions";
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

// assets
import { PlusOutlined } from "@ant-design/icons";
import AircraftCard from "sections/apps/aircrafts/AircraftCard";
import AddAircraft from "sections/apps/aircrafts/AddAircraft";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import Loader from "components/Loader";
import SearchAircraft from "sections/apps/aircrafts/SearchAircraft";
import TaskContext from "contexts/TaskContext";

const ListTasks = () => {
	const { user } = useContext(UserContext);
	const { findAllTasks } = useTask();

	const { tasks, totalTasks, loadingTask } = useContext(TaskContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "C") {
			navigate("/aircrafts/me", { replace: true });
		}
	}, []);

	useEffect(() => {
		findAllTasks("", 1);
	}, []);

	const { searchAllAircrafts } = useAircraft();

	const { searchAircrafts } = useContext(AircraftContext);

	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const [add, setAdd] = useState(false);
	const [aircraft, setAircraft] = useState(null);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const handleAdd = () => {
		setAdd(!add);
		if (aircraft && !add) setAircraft(null);
		searchAllAircrafts(search, page);
	};

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		searchAllAircrafts(search, page);
	}, [search, page]);

	useEffect(() => {}, [searchAircrafts]);
	console.log(tasks);
	return (
		<>
			<Box sx={{ position: "relative", marginBottom: 3 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchAircraft setSearch={setSearch} />
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

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={add} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddAircraft aircraft={aircraft} onCancel={handleAdd} />
			</Dialog>
		</>
	);
};

export default ListTasks;
