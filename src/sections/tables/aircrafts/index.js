import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, Typography, Box, Tooltip, Pagination, Stack, Grid, Button, Dialog } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import AddAircraft from "sections/apps/aircrafts/AddAircraft";
import SearchAircraftByAdmin from "sections/apps/aircrafts/SearchAircraftByAdmin";
import Loader from "components/Loader";
import { useNavigate } from "react-router";
import UserContext from "contexts/UserContext";
import { AircraftFilter } from "./AircraftFilter";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Matrícula", key: "registration" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
];

export default function AircraftsTable({ openFilter, reload }) {
	const { findAllAircrafts, approveAircraft, searchAllAircrafts } = useAircraft();

	const { aircrafts, totalAircrafts, loadingAircraft } = useContext(AircraftContext);
	const { user } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState({});

	const theme = useTheme();
	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleAdd = async () => {
		setOpen(false);

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		user.type === "A" || user.type === "S" ? await findAllAircrafts(search, page, paramsStatus) : await searchAllAircrafts(search, page);
	};

	const handleRedirect = (aircraftId) => {
		navigate(`/aircrafts/${aircraftId}`);
	};

	const handleApprove = async (event, aircraft, status) => {
		event.stopPropagation();
		await approveAircraft({ id_aircraft: aircraft.id_aircraft, approve: status });
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));
		await findAllAircrafts(search, page, paramsStatus);
	};

	useEffect(() => {
		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		user.type === "A" || user.type === "S" ? findAllAircrafts(search, page, paramsStatus) : searchAllAircrafts(search, page);
	}, [search, page, selectedStatus, reload]);

	useEffect(() => {}, [aircrafts]);

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
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Matrícula</TableCell>
							<TableCell align="center">Modelo</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingAircraft ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : aircrafts.length > 0 ? (
							aircrafts.map((aircraft) => (
								<TableRow
									hover
									key={aircraft.id_aircraft}
									sx={{ cursor: "pointer" }}
									onClick={() => {
										handleRedirect(aircraft.id_aircraft);
									}}
								>
									<TableCell align="center">
										{aircraft.status === "P" ? (
											<Box display="flex" gap={4} justifyContent="center">
												<Tooltip title="Aprovar">
													<LikeFilled
														style={{
															fontSize: 20,
															color: theme.palette.success.main,
															cursor: "pointer",
														}}
														onClick={async (event) => {
															await handleApprove(event, aircraft, "S");
														}}
													/>
												</Tooltip>
												<Tooltip title="Rejeitar">
													<DislikeFilled
														style={{
															fontSize: 20,
															color: theme.palette.error.main,
															cursor: "pointer",
														}}
														onClick={async (event) => {
															await handleApprove(event, aircraft, "N");
														}}
													/>
												</Tooltip>
											</Box>
										) : (
											<Chip color="success" variant="filled" size="small" label="Ativo" />
										)}
									</TableCell>
									<TableCell align="center">{aircraft.registration}</TableCell>
									<TableCell align="center">{aircraft.modelo}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma aeronave encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma aeronave cadastrada</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddAircraft onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
