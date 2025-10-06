import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Chip, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import { format } from "date-fns";
import Loader from "components/Loader";
import { useNavigate } from "react-router";
import { RequestFilter } from "./RequestFilter";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import SearchRequestControl from "sections/apps/requests/SearchRequestControl";

export default function RequestsControlLandingTakeoffTable({ openFilter, reload }) {
	const { findRequestsControl, updateRequestsControl } = useRequest();

	const { totalRequests, loadingRequest, requestsControl } = useContext(RequestContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	/* const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [dateFilter, setDateFilter] = useState({}); */

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleRedirect = (requestId) => {
		navigate(`/requests/${requestId}`);
	};

	const handleRegisterTime = async (requestId, type) => {
		const response = await updateRequestsControl(requestId, type);
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
										sx={{ cursor: "pointer" }}
										onClick={() => {
											handleRedirect(e.id_request);
										}}
									>
										<TableCell align="center">
											<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_request}`} />
										</TableCell>
										<TableCell align="center">{e.registration}</TableCell>
										<TableCell align="center">{e.landing_date}</TableCell>
										<TableCell align="center">
											{e.landing_created_at
												? e.landing_created_at
												: e.status === "A" && (
														<Button
															variant="contained"
															onClick={async (event) => {
																event.stopPropagation();
																await handleRegisterTime(e.id_request, "L");
															}}
														>
															Registrar
														</Button>
													)}
										</TableCell>
										<TableCell align="center">{e.landing_created_by}</TableCell>
										<TableCell align="center">{e.takeoff_date}</TableCell>
										<TableCell align="center">
											{e.takeoff_created_at
												? e.takeoff_created_at
												: e.status === "A" && (
														<Button
															variant="contained"
															onClick={async (event) => {
																event.stopPropagation();
																await handleRegisterTime(e.id_request, "T");
															}}
														>
															Registrar
														</Button>
													)}
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
