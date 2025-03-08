import { useMemo, useState, useEffect, useContext } from "react";

// material-ui
import { Grid, Stack, useMediaQuery, Button, FormControl, Select, MenuItem, Box, Dialog, Slide, Pagination, Typography } from "@mui/material";
// project import
import { PopupTransition } from "components/@extended/Transitions";
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

import makeData from "data/react-table";
import { GlobalFilter } from "utils/react-table";
import usePagination from "hooks/usePagination";

// assets
import { PlusOutlined } from "@ant-design/icons";
import HelicopterCard from "sections/apps/helicopters/HelicopterCard";
import AddHelicopter from "sections/apps/helicopters/AddHelicopter";
import AddHelicopterCard from "sections/apps/helicopters/AddHelicopterCard";
import HelicopterContext from "contexts/HelicopterContext";
import useHelicopter from "hooks/useHelicopter";

const allColumns = [
	{
		id: 1,
		header: "Padrão",
	},
	{
		id: 2,
		header: "RAB",
	},
	{
		id: 3,
		header: "Categoria",
	},
	{
		id: 4,
		header: "Nome responsável",
	},
	{
		id: 5,
		header: "Email responsável",
	},
];

const Dashboard = () => {
	const { findAllHelicopters } = useHelicopter();

	const { helicopters, setHelicopters } = useContext(HelicopterContext);

	const data = useMemo(() => makeData(4), []);
	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const [sortBy, setSortBy] = useState("");
	const [globalFilter, setGlobalFilter] = useState("");
	const [add, setAdd] = useState(false);
	const [helicopter, setHelicopter] = useState(null);
	const [page, setPage] = useState(1);

	const handleChange = (event) => {
		setSortBy(event.target.value);
	};

	const handleAdd = () => {
		setAdd(!add);
		if (helicopter && !add) setHelicopter(null);
	};

	// search
	useEffect(() => {
		const newData = data.filter((value) => {
			if (globalFilter) {
				return value.fatherName.toLowerCase().includes(globalFilter.toLowerCase());
			} else {
				return value;
			}
		});
		setHelicopters(newData);
	}, [globalFilter, data]);

	const PER_PAGE = 10;
	const count = Math.ceil(helicopters.length / PER_PAGE);
	const _DATA = usePagination(helicopters, PER_PAGE);

	const handleChangePage = (e, p) => {
		setPage(p);
		_DATA.jump(p);
	};

	useEffect(() => {
		findAllHelicopters();
	}, [helicopters]);

	return (
		<>
			<Box sx={{ position: "relative", marginBottom: 3 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<GlobalFilter preGlobalFilteredRows={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
							<Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
								Adicionar Helicóptero
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Box>
			<Grid container spacing={3}>
				<AddHelicopterCard />
				{helicopters.length > 0 ? (
					_DATA
						.currentData()
						.sort(function (a, b) {
							if (sortBy === "Padrão") return b.id_helicopter < a.id_helicopter ? 1 : -1;
							if (sortBy === "RAB") return a.rab.localeCompare(b.rab);
							if (sortBy === "Categoria") return a.category.localeCompare(b.category);
							if (sortBy === "Email responsável") return a.email.localeCompare(b.email);
							if (sortBy === "Nome responsável") return a.name.localeCompare(b.name);
							return a;
						})
						.map((helicopter, index) => (
							<Slide key={helicopter.id_helicopter} direction="up" in={true}>
								<Grid item xs={12} sm={6} lg={3}>
									<HelicopterCard data={helicopter} />
								</Grid>
							</Slide>
						))
				) : (
					<EmptyUserCard title={"Não há nenhum helicóptero vinculado a você."} />
				)}
			</Grid>
			<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
				<Pagination count={count} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
			</Stack>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={add} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddHelicopter helicopter={helicopter} onCancel={handleAdd} />
			</Dialog>
		</>
	);
};

export default Dashboard;
