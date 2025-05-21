import { useState, useEffect, useContext } from "react";

// material-ui
import { Grid, Stack, useMediaQuery, Button, FormControl, Select, MenuItem, Box, Dialog, Pagination, Typography } from "@mui/material";
// project import
import { PopupTransition } from "components/@extended/Transitions";
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

// assets
import { PlusOutlined } from "@ant-design/icons";
import AircraftCard from "sections/apps/aircrafts/AircraftCard";
import AddAircraft from "sections/apps/aircrafts/AddAircraft";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import UserContext from "contexts/UserContext";
import Loader from "components/Loader";
import SearchAircraft from "sections/apps/aircrafts/SearchAircraft";

const allColumns = [
	{
		id: 1,
		header: "Padrão",
	},
	{
		id: 2,
		header: "Matrícula",
	},
	{
		id: 3,
		header: "Categoria",
	},
];

const MyAircrafts = () => {
	const { searchAllAircrafts } = useAircraft();

	const { searchAircrafts, totalSearchAircrafts, loadingAircraft } = useContext(AircraftContext);
	const { user } = useContext(UserContext);

	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const [sortBy, setSortBy] = useState("");
	const [add, setAdd] = useState(false);
	const [aircraft, setAircraft] = useState(null);
	const [page, setPage] = useState(1);
	const [reload, setReload] = useState(false);
	const [search, setSearch] = useState("");

	const handleChange = (event) => {
		setSortBy(event.target.value);
	};

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
	}, [search, page, reload]);

	useEffect(() => {}, [searchAircrafts]);

	return (
		<>
			<Box sx={{ position: "relative", marginBottom: 3 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchAircraft setSearch={setSearch} />
						<Stack direction={matchDownSM ? "column" : "row"} alignItems="center" spacing={1}>
							<FormControl sx={{ m: 1, minWidth: 120 }}>
								<Select
									value={sortBy}
									onChange={handleChange}
									displayEmpty
									inputProps={{ "aria-label": "Without label" }}
									renderValue={(selected) => {
										if (!selected) {
											return <Typography variant="subtitle1">Ordenar por</Typography>;
										}

										return <Typography variant="subtitle2">Ordenar por ({sortBy})</Typography>;
									}}
									sx={{
										height: 40,
										paddingY: 0,
									}}
								>
									{allColumns.map((column) => {
										return (
											<MenuItem key={column.id} value={column.header}>
												{column.header}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
							{(user.type === "O" || user.type === "P") && (
								<Button
									variant="contained"
									startIcon={<PlusOutlined />}
									onClick={handleAdd}
									sx={{
										height: 40,
										paddingY: 0,
									}}
								>
									Adicionar Aeronave
								</Button>
							)}
						</Stack>
					</Stack>
				</Stack>
			</Box>
			{loadingAircraft ? (
				<Loader />
			) : searchAircrafts.length > 0 ? (
				<Grid container spacing={3}>
					{searchAircrafts
						.sort(function (a, b) {
							if (sortBy === "Padrão") return b.id_aircraft < a.id_aircraft ? 1 : -1;
							if (sortBy === "Matrícula") return a.registration.localeCompare(b.registration);
							if (sortBy === "Categoria") return a.category.localeCompare(b.category);
							return a;
						})
						.map((aircraft) => (
							<Grid item key={aircraft.id_aircraft} xs={12} sm={6} md={4}>
								<AircraftCard data={aircraft} setReload={setReload} reload={reload} />
							</Grid>
						))}
				</Grid>
			) : (
				<Grid container>
					<EmptyUserCard title={"Não há nenhuma aeronave vinculada a você."} />
				</Grid>
			)}
			<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
				<Pagination count={totalSearchAircrafts} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
			</Stack>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={add} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddAircraft aircraft={aircraft} onCancel={handleAdd} />
			</Dialog>
		</>
	);
};

export default MyAircrafts;
