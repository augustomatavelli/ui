// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Chip, Button, Tooltip } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import Loader from "components/Loader";
import { RequestFilter } from "./RequestFilter";

export default function MyRequestsTable({ openFilter }) {
	const { searchAllRequests } = useRequest();

	const { searchRequests, totalSearchRequests, loadingRequest } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	useEffect(() => {
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		searchAllRequests(search, page, paramsStatus);
	}, [search, page, selectedStatus]);

	useEffect(() => {}, [searchRequests]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchRequestByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalSearchRequests} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{openFilter && <RequestFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Aeronave</TableCell>
							<TableCell align="center">Aeródromo</TableCell>
							<TableCell align="center">Pouso</TableCell>
							<TableCell align="center">Decolagem</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Data solicitação</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<Loader />
						) : searchRequests.length > 0 ? (
							searchRequests.map((e) => (
								<TableRow
									hover
									key={e.id_request}
									sx={{ cursor: "pointer" }}
									onClick={() => {
										handleRedirect(e.id_request);
									}}
								>
									<TableCell align="center">
										<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_request}`} />
									</TableCell>
									<TableCell align="center">{e.registration}</TableCell>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">{format(new Date(e.landing_date), "dd/MM/yyyy HH:mm")}</TableCell>
									<TableCell align="center">{e.takeoff_date ? format(new Date(e.takeoff_date), "dd/MM/yyyy HH:mm") : "-"}</TableCell>
									<TableCell align="center">
										<Chip
											color={e.status === "A" ? "primary" : e.status === "P" ? "warning" : e.status === "F" ? "success" : e.status === "C" ? "error" : "error"}
											variant="filled"
											size="small"
											label={e.status === "A" ? "Em aberto" : e.status === "P" ? "Pendente" : e.status === "F" ? "Finalizado" : e.status === "C" ? "Cancelado" : "Rejeitado"}
											sx={{ color: e.status === "P" ? "black" : "white" }}
										/>
									</TableCell>
									<TableCell align="center">{format(new Date(e.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={8} align="center">
									<Typography variant="h5">Nenhuma solicitação encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={8} align="center">
									<Typography variant="h5">Nenhuma solicitação cadastrada</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
