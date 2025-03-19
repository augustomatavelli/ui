// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import AddRequest from "sections/apps/requests/AddRequest";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Tipo", key: "type" },
	{ label: "Capacidade", key: "capacity" },
	{ label: "Tipo", key: "type" },
];

export default function RequestsTable() {
	const { findAllRequests } = useRequest();

	const { requests, totalRequests } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		setOpen(!open);
		await findAllRequests(search, page);
	};

	useEffect(() => {
		findAllRequests(search, page);
	}, [search, page]);

	useEffect(() => {}, [requests]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchRequestByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalRequests} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Tipo</TableCell>
							<TableCell align="center">Capacidade</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{requests.length > 0 ? (
							requests.map((e) => (
								<TableRow hover key={e.id_request}>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">{e.type === "H" ? "Heliporto" : "-"}</TableCell>
									<TableCell align="center">{e.capacity}</TableCell>
								</TableRow>
							))
						) : search ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma solicitação encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma solicitação cadastrada</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddRequest onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
