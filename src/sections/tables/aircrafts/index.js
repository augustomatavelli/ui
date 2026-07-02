import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Button, Dialog, LinearProgress } from "@mui/material";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import AddAircraft from "sections/apps/aircrafts/AddAircraft";
import SearchAircraftByAdmin from "sections/apps/aircrafts/SearchAircraftByAdmin";
import { useNavigate } from "react-router";
import UserContext from "contexts/UserContext";
import { AircraftFilter } from "./AircraftFilter";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import AircraftTableRow from "./AircraftTableRow";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Matrícula", key: "registration" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
];

const COLUMN_COUNT = 4;

export default function AircraftsTable({ openFilter, reload, setReload }) {
	const { findAllAircrafts, approveAircraft, searchAllAircrafts, updateAircraft } = useAircraft();

	const { aircrafts, totalAircrafts, loadingAircraft } = useContext(AircraftContext);
	const { user } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleAdd = async () => {
		setOpen(false);

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		user.type === "A" || user.type === "S" ? await findAllAircrafts(search, page, paramsStatus) : await searchAllAircrafts(search, page);
	};

	const handleRedirect = useCallback(
		(aircraftId) => {
			navigate(`/aircrafts/${aircraftId}`);
		},
		[navigate],
	);

	const handleApprove = useCallback(
		async (event, aircraft, status) => {
			event.stopPropagation();
			await approveAircraft({ id_aircraft: aircraft.id_aircraft, approve: status });
			const statusParams = Object.keys(selectedStatus);
			const paramsStatus = new URLSearchParams();
			paramsStatus.set("status", statusParams.join(","));
			await findAllAircrafts(search, page, paramsStatus);
		},
		[approveAircraft, findAllAircrafts, search, page, selectedStatus],
	);

	const handleToggleMembership = useCallback(
		async (aircraft, checked) => {
			const response = await updateAircraft(aircraft.id_aircraft, {
				membership: checked ? "S" : "N",
			});
			if (response.status === 200) {
				setReload((prev) => !prev);
			}
		},
		[updateAircraft, setReload],
	);

	useEffect(() => {
		setPage(1);
	}, [search, selectedStatus]);

	useEffect(() => {
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		const controller = new AbortController();
		user.type === "A" || user.type === "S" ? findAllAircrafts(search, page, paramsStatus, controller.signal) : searchAllAircrafts(search, page, controller.signal);

		return () => controller.abort();
	}, [search, page, selectedStatus, reload]);

	const isEmpty = useMemo(() => !loadingAircraft && aircrafts.length === 0, [loadingAircraft, aircrafts.length]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchAircraftByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalAircrafts} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleOpen}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar aeronave
						</Button>
					</Stack>
				</Grid>
				{openFilter && <AircraftFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
				{loadingAircraft && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Matrícula</TableCell>
							<TableCell align="center">Modelo</TableCell>
							<TableCell align="center">Mensalista</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingAircraft ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhuma aeronave foi encontrada com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							aircrafts.map((aircraft) => (
								<AircraftTableRow
									key={aircraft.id_aircraft}
									aircraft={aircraft}
									onRedirect={handleRedirect}
									onApprove={handleApprove}
									onToggleMembership={handleToggleMembership}
								/>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddAircraft onCancel={handleAdd} />
			</Dialog>
		</>
	);
}

AircraftsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
	setReload: PropTypes.func,
};
