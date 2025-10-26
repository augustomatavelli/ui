import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Chip, Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import Loader from "components/Loader";
import { useNavigate } from "react-router";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import SearchRequestControl from "sections/apps/requests/SearchRequestControl";
import UserContext from "contexts/UserContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import { SaveOutlined } from "@ant-design/icons";
import { ptBR } from "date-fns/locale";

export default function RequestsControlLandingTakeoffTable({ openFilter, reload }) {
	const { findRequestsControl, updateRequestsControl } = useRequest();

	const { totalRequests, loadingRequest, requestsControl } = useContext(RequestContext);
	const { user } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	/* const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({}); */
	const [landingDate, setLandingDate] = useState(null);
	const [takeoffDate, setTakeoffDate] = useState(null);

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	const handleRegisterTime = async (requestId, type, date) => {
		const response = await updateRequestsControl(requestId, type, date);
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
	};

	useEffect(() => {
		/* if (selectedPeriod === "custom" && (!dateFilter?.startDate || !dateFilter?.endDate)) {
			return;
		}

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(",")); */

		findRequestsControl(search, page /* , paramsStatus, selectedPeriod, dateFilter */);
	}, [search, page, /*  selectedStatus, selectedPeriod, dateFilter, */ reload]);

	useEffect(() => {}, [requestsControl]);

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
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : requestsControl.length > 0 ? (
							requestsControl.map((e) => (
								<>
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
																value={landingDate ? landingDate[e.id_request] : null}
																disablePast
																minDateTime={dayjs()}
																onChange={(newValue) => setLandingDate(newValue)}
																slotProps={{
																	field: { format: "dd/MM/yyyy HH:mm" },
																	textField: { error: false, size: "small" },
																}}
															/>
														</LocalizationProvider>
														<SaveOutlined
															style={{ cursor: "pointer", fontSize: "20px" }}
															onClick={async (event) => {
																event.stopPropagation();
																await handleRegisterTime(e.id_request, "L", dayjs(landingDate));
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
																value={takeoffDate ? takeoffDate[e.id_request] : null}
																disablePast
																minDateTime={dayjs()}
																onChange={(newValue) => setTakeoffDate(newValue)}
																slotProps={{
																	field: { format: "dd/MM/yyyy HH:mm" },
																	textField: { error: false, size: "small" },
																}}
															/>
														</LocalizationProvider>
														<SaveOutlined
															style={{ cursor: "pointer", fontSize: "20px" }}
															onClick={async (event) => {
																event.stopPropagation();
																await handleRegisterTime(e.id_request, "T", dayjs(takeoffDate));
															}}
														/>
													</>
												) : null}
											</Box>
										</TableCell>
										<TableCell align="center">{e.takeoff_created_by}</TableCell>
									</TableRow>
								</>
							))
						) : search /* || openFilter */ ? (
							<TableRow>
								<TableCell colSpan={11} align="center">
									<Typography variant="h5">Nenhuma solicitação encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={11} align="center">
									<Typography variant="h5">Nenhuma solicitação em aberto</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
