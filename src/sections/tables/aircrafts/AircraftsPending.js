// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, Typography, Box, Tooltip, Stack, Pagination, Grid } from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";
import useAircraft from "hooks/useAircraft";
import { formatPhoneNumber } from "utils/format/formatPhoneNumber";
import SearchAircraftPending from "sections/apps/aircrafts/SearchAircraftPending";
import AircraftContext from "contexts/AircraftContext";
import { formatCpfCnpj } from "utils/format/formatDoc";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function AircraftPendingTable() {
	const { findAllPendingAircrafts, approveAircraft } = useAircraft();

	const { aircraftsPending, totalAircraftPending } = useContext(AircraftContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const theme = useTheme();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		findAllPendingAircrafts(search, page);
	}, [search, page]);

	useEffect(() => {}, [aircraftsPending]);

	return (
		<MainCard>
			<Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<SearchAircraftPending setSearch={setSearch} />
				<Stack spacing={2} sx={{ p: 2.5, width: "100%", mb: 1 }} alignItems="flex-end">
					<Pagination count={totalAircraftPending} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
				</Stack>
			</Grid>

			<TableContainer>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">RAB</TableCell>
							<TableCell align="center">Categoria</TableCell>
							<TableCell align="center">Plano</TableCell>
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">CPF/CNPJ</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{aircraftsPending.length > 0 ? (
							aircraftsPending.map((aircraft) => (
								<TableRow hover key={aircraft.id_aircraft}>
									<TableCell align="center">
										<Box display="flex" gap={4} justifyContent="center">
											<Tooltip title="Aprovar">
												<LikeFilled
													style={{
														fontSize: 20,
														color: theme.palette.success.main,
														cursor: "pointer",
													}}
													onClick={async () => {
														await approveAircraft({ id_aircraft: aircraft.id_aircraft, approve: "S" });
														await findAllPendingAircrafts(search, page);
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
													onClick={async () => {
														await approveAircraft({ id_aircraft: aircraft.id_aircraft, approve: "N" });
														await findAllPendingAircrafts(search, page);
													}}
												/>
											</Tooltip>
										</Box>
									</TableCell>
									<TableCell align="center">{aircraft.rab}</TableCell>
									<TableCell align="center">{aircraft.category}</TableCell>
									<TableCell align="center">{aircraft.membership === "S" ? "Mensalista" : "Avulso"}</TableCell>
									<TableCell align="center">{aircraft.name}</TableCell>
									<TableCell align="center">{aircraft.email}</TableCell>
									<TableCell align="center">{formatPhoneNumber(aircraft.mobile)}</TableCell>
									<TableCell align="center">{aircraft.cpf ? formatCpfCnpj(aircraft.cpf) : formatCpfCnpj(aircraft.cnpj)}</TableCell>
								</TableRow>
							))
						) : search ? (
							<TableRow>
								<TableCell colSpan={8} align="center">
									<Typography variant="h5">Nenhuma aeronave encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={8} align="center">
									<Typography variant="h5">Nenhuma aeronave pendente</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</MainCard>
	);
}
