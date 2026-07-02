import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Chip, LinearProgress } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";
import { useNavigate } from "react-router";
import { RequestFilter } from "./RequestFilter";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

const COLUMN_COUNT = 7;

export default function MyRequestsTable({ openFilter, reload }) {
	const { searchAllRequests } = useRequest();

	const { searchRequests, totalSearchRequests, loadingRequest } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	useEffect(() => {
		if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		const controller = new AbortController();
		searchAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter, controller.signal);

		return () => controller.abort();
	}, [search, page, selectedStatus, selectedPeriod, dateFilter, reload]);

	const isEmpty = useMemo(() => !loadingRequest && searchRequests.length === 0, [loadingRequest, searchRequests.length]);


	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchRequestByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalSearchRequests} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{openFilter && (
					<RequestFilter
						selectedStatus={selectedStatus}
						setSelectedStatus={setSelectedStatus}
						selectedPeriod={selectedPeriod}
						setSelectedPeriod={setSelectedPeriod}
						dateFilter={dateFilter}
						setDateFilter={setDateFilter}
					/>
				)}
				{loadingRequest && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Aeronave</TableCell>
							<TableCell align="center">Helicentro</TableCell>
							<TableCell align="center">Pouso</TableCell>
							<TableCell align="center">Decolagem</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Data solicitação</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title={search || openFilter ? "Nenhuma solicitação encontrada" : "Nenhuma solicitação cadastrada"} />
								</TableCell>
							</TableRow>
						) : (
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
									<TableCell align="center">{e.landing_date ? e.landing_date : "-"}</TableCell>
									<TableCell align="center">{e.takeoff_date ? e.takeoff_date : "-"}</TableCell>
									<TableCell align="center">
										<Chip
											color={e.absence === "S" ? "warning" : e.status === "A" ? "primary" : e.status === "P" ? "warning" : e.status === "F" ? "success" : e.status === "C" ? "error" : "error"}
											variant="filled"
											size="small"
											label={
												e.absence === "S" ? "Ausente" : e.status === "A" ? "Em aberto" : e.status === "P" ? "Pendente" : e.status === "F" ? "Finalizado" : e.status === "C" ? "Cancelado" : "Rejeitado"
											}
											sx={{ color: e.status === "P" ? "#252525" : "white" }}
										/>
									</TableCell>
									<TableCell align="center">{e.created_at}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
