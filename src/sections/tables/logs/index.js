import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, Pagination, Stack, Grid, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import useLog from "hooks/useLogs";
import LogContext from "contexts/LogContext";
import SearchLogByAdmin from "sections/apps/logs/SearchLogByAdmin";
import { LogFilter } from "./LogFilter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

export default function LogsTable({ openFilter, reload }) {
	const { findAllLogs } = useLog();

	const { logs, totalLogs, loadingLog } = useContext(LogContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedEntity, setSelectedEntity] = useState({});
	const [selectedAction, setSelectedAction] = useState({});

	const theme = useTheme();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		const actionParams = Object.keys(selectedAction);
		const paramsAction = new URLSearchParams();
		paramsAction.set("action", actionParams.join(","));

		const entitiesParams = Object.keys(selectedEntity);
		const paramsEntities = new URLSearchParams();
		paramsEntities.set("entity", entitiesParams.join(","));

		findAllLogs(search, page, paramsAction, paramsEntities);
	}, [search, page, selectedAction, selectedEntity, reload]);

	useEffect(() => {}, [logs]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchLogByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalLogs} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{openFilter && <LogFilter selectedEntity={selectedEntity} setSelectedEntity={setSelectedEntity} selectedAction={selectedAction} setSelectedAction={setSelectedAction} />}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Usuário</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Ação</TableCell>
							<TableCell align="center">Entidade</TableCell>
							<TableCell align="center">ID</TableCell>
							<TableCell align="center">Campo</TableCell>
							<TableCell align="center">Antigo</TableCell>
							<TableCell align="center">Novo</TableCell>
							<TableCell align="center">Data</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingLog ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : logs.length > 0 ? (
							logs.map((log) => (
								<TableRow hover key={log.id}>
									<TableCell align="center">#{log.id}</TableCell>
									<TableCell align="center">{log.name}</TableCell>
									<TableCell align="center">{log.email}</TableCell>
									<TableCell align="center">
										<Chip
											label={log.action}
											color={log.action === "C" ? "success" : log.action === "E" ? "warning" : "error"}
											sx={{ fontWeight: "bold", color: log.action !== "E" ? "white" : theme.palette.action.active }}
										></Chip>
									</TableCell>
									<TableCell align="center">{log.entity_name}</TableCell>
									<TableCell align="center">
										{(() => {
											const keys = ["id_aircraft", "id_operator", "id_product", "id_service", "id_request", "id_landing_site"];
											const value = keys.map((k) => log[k]).find((v) => v !== null);
											return value ?? "-";
										})()}
									</TableCell>
									<TableCell align="center">{log.field}</TableCell>
									<TableCell align="center">{log.old ? log.old : "-"}</TableCell>
									<TableCell align="center">{log.new}</TableCell>
									<TableCell align="center">{log.date}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={10} align="center">
									<Typography variant="h5">Nenhum log encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={10} align="center">
									<Typography variant="h5">Nenhum log registrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
