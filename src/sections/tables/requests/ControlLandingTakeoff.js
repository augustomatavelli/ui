import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Chip, Box, LinearProgress } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import { useNavigate } from "react-router";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import SearchRequestControl from "sections/apps/requests/SearchRequestControl";
import UserContext from "contexts/UserContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { SaveOutlined } from "@ant-design/icons";
import { now, toApi } from "utils/date";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

const COLUMN_COUNT = 8;

export default function RequestsControlLandingTakeoffTable({ openFilter, reload }) {
	const { findRequestsControl, updateRequestsControl } = useRequest();

	const { totalRequests, loadingRequest, requestsControl } = useContext(RequestContext);
	const { user } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	/* const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({}); */
	const [landingDate, setLandingDate] = useState({});
	const [takeoffDate, setTakeoffDate] = useState({});
	const [savingTime, setSavingTime] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	const handleRegisterTime = async (requestId, type, date) => {
		const key = `${requestId}-${type}`;
		setSavingTime((prev) => ({ ...prev, [key]: true }));
		try {
			const response = await updateRequestsControl(requestId, type, date);
			if (!response) {
				return;
			}
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
			await findRequestsControl(search, page);
		} finally {
			setSavingTime((prev) => ({ ...prev, [key]: false }));
		}
	};

	useEffect(() => {
		/* if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(",")); */

		const controller = new AbortController();
		findRequestsControl(search, page, controller.signal /* , paramsStatus, selectedPeriod, dateFilter */);

		return () => controller.abort();
	}, [search, page, /*  selectedStatus, selectedPeriod, dateFilter, */ reload]);

	const isEmpty = useMemo(() => !loadingRequest && requestsControl.length === 0, [loadingRequest, requestsControl.length]);


	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchRequestControl setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalRequests} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{/* {openFilter && (
					<RequestFilter
						selectedStatus={selectedStatus}
						setSelectedStatus={setSelectedStatus}
						selectedPeriod={selectedPeriod}
						setSelectedPeriod={setSelectedPeriod}
						dateFilter={dateFilter}
						setDateFilter={setDateFilter}
					/>
				)} */}
				{loadingRequest && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Matrícula</TableCell>
							<TableCell align="center">Pouso agendado</TableCell>
							<TableCell align="center">Pouso realizado</TableCell>
							<TableCell align="center">Responsável</TableCell>
							<TableCell align="center">Decolagem agendada</TableCell>
							<TableCell align="center">Decolagem realizada</TableCell>
							<TableCell align="center">Responsável</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title={search ? "Nenhuma solicitação encontrada" : "Nenhuma solicitação em aberto"} />
								</TableCell>
							</TableRow>
						) : (
							requestsControl.map((e) => (
								<TableRow
									hover
									key={e.id_request}
									sx={{ cursor: user.type !== "C" ? "pointer" : "default" }}
									onClick={() => {
										user.type !== "C" && handleRedirect(e.id_request);
									}}
								>
										<TableCell align="center">
											<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_request}`} />
										</TableCell>
										<TableCell align="center">{e.registration}</TableCell>
										<TableCell align="center">{e.landing_date}</TableCell>
										<TableCell align="center" onClick={(event) => event.stopPropagation()}>
											<Box
												sx={{
													display: "flex",
													gap: 1,
													alignItems: "center",
													justifyContent: "center",
													minHeight: "40px",
												}}
											>
												{e.landing_created_at ? (
													<Typography>{e.landing_created_at}</Typography>
												) : e.status === "A" ? (
													<>
														<LocalizationProvider dateAdapter={AdapterDateFns}>
															<DateTimePicker
																value={landingDate?.[e.id_request] ?? null}
																disablePast
																minDateTime={now()}
																onChange={(newValue) => setLandingDate((prev) => ({ ...prev, [e.id_request]: newValue }))}
																disabled={savingTime[`${e.id_request}-L`]}
																slotProps={{
																	field: { format: "dd/MM/yyyy HH:mm" },
																	textField: { error: false, size: "small" },
																}}
															/>
														</LocalizationProvider>
														<SaveOutlined
															style={{ cursor: savingTime[`${e.id_request}-L`] ? "not-allowed" : "pointer", fontSize: "20px", opacity: savingTime[`${e.id_request}-L`] ? 0.5 : 1 }}
															onClick={async (event) => {
																event.stopPropagation();
																if (savingTime[`${e.id_request}-L`]) return;
																await handleRegisterTime(e.id_request, "L", toApi(landingDate?.[e.id_request]));
															}}
														/>
													</>
												) : null}
											</Box>
										</TableCell>
										<TableCell align="center">{e.landing_created_by}</TableCell>
										<TableCell align="center">{e.takeoff_date}</TableCell>
										<TableCell align="center" onClick={(event) => event.stopPropagation()}>
											<Box
												sx={{
													display: "flex",
													gap: 1,
													alignItems: "center",
													justifyContent: "center",
													minHeight: "40px",
												}}
											>
												{e.takeoff_created_at ? (
													<Typography>{e.takeoff_created_at}</Typography>
												) : e.status === "A" ? (
													<>
														<LocalizationProvider dateAdapter={AdapterDateFns}>
															<DateTimePicker
																value={takeoffDate?.[e.id_request] ?? null}
																disablePast
																minDateTime={now()}
																onChange={(newValue) => setTakeoffDate((prev) => ({ ...prev, [e.id_request]: newValue }))}
																disabled={savingTime[`${e.id_request}-T`]}
																slotProps={{
																	field: { format: "dd/MM/yyyy HH:mm" },
																	textField: { error: false, size: "small" },
																}}
															/>
														</LocalizationProvider>
														<SaveOutlined
															style={{ cursor: savingTime[`${e.id_request}-T`] ? "not-allowed" : "pointer", fontSize: "20px", opacity: savingTime[`${e.id_request}-T`] ? 0.5 : 1 }}
															onClick={async (event) => {
																event.stopPropagation();
																if (savingTime[`${e.id_request}-T`]) return;
																await handleRegisterTime(e.id_request, "T", toApi(takeoffDate?.[e.id_request]));
															}}
														/>
													</>
												) : null}
											</Box>
										</TableCell>
										<TableCell align="center">{e.takeoff_created_by}</TableCell>
									</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
