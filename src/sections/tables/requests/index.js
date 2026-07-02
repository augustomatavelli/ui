import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Dialog, LinearProgress } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import AddRequest from "sections/apps/requests/ScheduleFormLanding";
import SearchRequestByAdmin from "sections/apps/requests/SearchRequestByAdmin";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { useNavigate } from "react-router";
import { RequestFilter } from "./RequestFilter";
import AlertFinalizeRequest from "sections/apps/requests/AlertFinalizeRequest";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import RequestTableRow from "./RequestTableRow";

const COLUMN_COUNT = 9;

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

	const handleRedirect = useCallback(
		(requestId) => {
			navigate(`/requests/${requestId}`);
		},
		[navigate],
	);

	const handleOpenFinalize = useCallback((requestId) => {
		setSelectedRequestId(requestId);
		setOpenFinalizeRequest(true);
	}, []);

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

		const controller = new AbortController();
		findAllRequests(search, page, paramsStatus, selectedPeriod, dateFilter, controller.signal);

		return () => controller.abort();
	}, [search, page, selectedStatus, selectedPeriod, dateFilter, reload]);

	const isEmpty = useMemo(() => !loadingRequest && requests.length === 0, [loadingRequest, requests.length]);

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
				{loadingRequest && <LinearProgress />}
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
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhuma solicitação foi encontrada com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							requests.map((e) => <RequestTableRow key={e.id_request} request={e} onRedirect={handleRedirect} onFinalize={handleOpenFinalize} />)
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

RequestsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
