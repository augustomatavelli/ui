import { useState, useEffect, useContext } from "react";

// material-ui
import { Grid, Stack, useMediaQuery, Button, FormControl, Select, MenuItem, Box, Dialog, Slide, Pagination, Typography } from "@mui/material";
// project import
import { PopupTransition } from "components/@extended/Transitions";
import EmptyUserCard from "components/cards/skeleton/EmptyUserCard";

import { GlobalFilter } from "utils/react-table";

// assets
import { PlusOutlined } from "@ant-design/icons";
import HelicopterCard from "sections/apps/helicopters/HelicopterCard";
import AddHelicopter from "sections/apps/helicopters/AddHelicopter";
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

const MyHelicopters = () => {
	const { findAllHelicopters } = useHelicopter();

	const { helicopters } = useContext(HelicopterContext);

	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const [sortBy, setSortBy] = useState("");
	const [globalFilter, setGlobalFilter] = useState("");
	const [add, setAdd] = useState(false);
	const [helicopter, setHelicopter] = useState(null);
	const [page, setPage] = useState(1);
	const [filteredHelicopters, setFilteredHelicopters] = useState([]);

	const handleChange = (event) => {
		setSortBy(event.target.value);
	};

	const handleAdd = () => {
		setAdd(!add);
		if (helicopter && !add) setHelicopter(null);
	};

	const handleChangePage = (e, p) => {
		setPage(p);
		filteredHelicopters.jump(p);
	};

	const PER_PAGE = 10;
	const count = Math.ceil(filteredHelicopters.length / PER_PAGE);

	// search
	useEffect(() => {
		const newData = helicopters.filter((value) => {
			if (globalFilter) {
				const filterLower = globalFilter.toLowerCase();
				return value.rab.toLowerCase().includes(filterLower) || value.name.toLowerCase().includes(filterLower) || value.email.toLowerCase().includes(filterLower);
			} else {
				setFilteredHelicopters(helicopters);
			}
			return true;
		});
		setFilteredHelicopters(newData);
	}, [globalFilter, helicopters]);

	useEffect(() => {
		findAllHelicopters();
	}, []);

	return (
		<>
			<Box sx={{ position: "relative", marginBottom: 3 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<GlobalFilter preGlobalFilteredRows={helicopters} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
			<Grid
				container
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: 2,
				}}
			>
				{filteredHelicopters.length > 0 ? (
					<>
						{filteredHelicopters
							.sort(function (a, b) {
								if (sortBy === "Padrão") return b.id_helicopter < a.id_helicopter ? 1 : -1;
								if (sortBy === "RAB") return a.rab.localeCompare(b.rab);
								if (sortBy === "Categoria") return a.category.localeCompare(b.category);
								if (sortBy === "Email responsável") return a.email.localeCompare(b.email);
								if (sortBy === "Nome responsável") return a.name.localeCompare(b.name);
								return a;
							})
							.map((helicopter) => (
								<Grid key={helicopter.id_helicopter}>
									<HelicopterCard data={helicopter} />
								</Grid>
							))}
					</>
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

export default MyHelicopters;
