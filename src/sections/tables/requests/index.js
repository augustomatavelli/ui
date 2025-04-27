// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Chip, Button } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import AddRequest from "sections/apps/requests/ScheduleForm";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";
import { format } from "date-fns";
import Loader from "components/Loader";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useNavigate } from "react-router";
import { RequestFilter } from "./RequestFilter";

export default function RequestsTable({ openFilter }) {
	const { findAllRequests, updateStatus } = useRequest();

	const { requests, totalRequests, loadingRequest } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		setOpen(!open);
		await findAllRequests(search, page, paramsStatus);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	const handleFinalize = async (requestId) => {
		const response = await updateStatus(requestId);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));
		await findAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter);
	};

	useEffect(() => {
		if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		findAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter);
	}, [search, page, selectedStatus, selectedPeriod, dateFilter]);

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
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell />
							<TableCell align="center">Solicitado por</TableCell>
							<TableCell align="center">Matrícula</TableCell>
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
						) : requests.length > 0 ? (
							requests.map((e) => (
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
									<TableCell align="center">
										{e.status === "A" && (
											<Button
												variant="contained"
												size="small"
												onClick={async (event) => {
													event.stopPropagation();
													await handleFinalize(e.id_request);
												}}
											>
												Finalizar
											</Button>
										)}
									</TableCell>
									<TableCell align="center">{e.user}</TableCell>
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
								<TableCell colSpan={11} align="center">
									<Typography variant="h5">Nenhuma solicitação encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={11} align="center">
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
