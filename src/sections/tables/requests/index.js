import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Chip, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import AddRequest from "sections/apps/requests/ScheduleFormLanding";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";
import { format } from "date-fns";
import Loader from "components/Loader";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useNavigate } from "react-router";
import { RequestFilter } from "./RequestFilter";
import AlertFinalizeRequest from "sections/apps/requests/AlertFinalizeRequest";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";

export default function RequestsTable({ openFilter, reload }) {
	const { findAllRequests, updateStatus } = useRequest();

	const { requests, totalRequests, loadingRequest, setRequestResume } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({});
	const [openFinalizeRequest, setOpenFinalizeRequest] = useState(false);
	const [selectedRequestId, setSelectedRequestId] = useState(null);

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
		setOpenFinalizeRequest(false);
		setRequestResume({});
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));
		await findAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter);
	};

	const handleClose = async () => {
		setOpenFinalizeRequest(false);
		setSelectedRequestId(null);
	};

	useEffect(() => {
		if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		findAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter);
	}, [search, page, selectedStatus, selectedPeriod, dateFilter, reload]);

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
							<TableCell align="center">Helicentro</TableCell>
							<TableCell align="center">Pouso</TableCell>
							<TableCell align="center">Decolagem</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Data solicitação</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : requests.length > 0 ? (
							requests.map((e) => (
								<>
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
														setSelectedRequestId(e.id_request);
														setOpenFinalizeRequest(true);
													}}
												>
													Finalizar
												</Button>
											)}
										</TableCell>
										<TableCell align="center">{e.user}</TableCell>
										<TableCell align="center">{e.registration}</TableCell>
										<TableCell align="center">{e.name}</TableCell>
										<TableCell>
											{e.landing_date ? (
												<Grid
													style={{
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
														alignItems: "center",
													}}
												>
													<Grid style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
														<EventIcon fontSize="inherit" style={{ marginRight: 4 }} />
														{e.landing_date}
													</Grid>
													{e.landing_time && (
														<Grid style={{ display: "flex", alignItems: "center", color: "green", marginTop: 2 }}>
															<CheckCircleIcon fontSize="inherit" style={{ marginRight: 4 }} />
															{e.landing_time}
														</Grid>
													)}
												</Grid>
											) : (
												<Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>-</Grid>
											)}
										</TableCell>
										<TableCell>
											{e.takeoff_date ? (
												<Grid
													style={{
														display: "flex",
														flexDirection: "column",
														justifyContent: "center",
														alignItems: "center",
													}}
												>
													<Grid style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
														<EventIcon fontSize="inherit" style={{ marginRight: 4 }} />
														{e.takeoff_date}
													</Grid>
													{e.takeoff_time && (
														<Grid style={{ display: "flex", alignItems: "center", color: "green", marginTop: 2 }}>
															<CheckCircleIcon fontSize="inherit" style={{ marginRight: 4 }} />
															{e.takeoff_time}
														</Grid>
													)}
												</Grid>
											) : (
												<Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>-</Grid>
											)}
										</TableCell>
										<TableCell align="center">
											<Chip
												color={e.absence === "S" ? "warning" : e.status === "A" ? "primary" : e.status === "P" ? "warning" : e.status === "F" ? "success" : e.status === "C" ? "error" : "error"}
												variant="filled"
												size="small"
												label={
													e.absence === "S"
														? "Ausente"
														: e.status === "A"
															? "Em aberto"
															: e.status === "P"
																? "Pendente"
																: e.status === "F"
																	? "Finalizado"
																	: e.status === "C"
																		? "Cancelado"
																		: "Rejeitado"
												}
												sx={{ color: e.status === "P" || e.absence === "S" ? "#252525" : "white" }}
											/>
										</TableCell>
										<TableCell align="center">{e.created_at}</TableCell>
									</TableRow>
								</>
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
			<AlertFinalizeRequest open={openFinalizeRequest} id={selectedRequestId} handleClose={handleClose} handleDelete={handleFinalize} />
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddRequest onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
