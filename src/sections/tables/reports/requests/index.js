import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Collapse, IconButton, Grid, Card, FormControl, Select, MenuItem, TableFooter } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import useReport from "hooks/useReport";
import ReportContext from "contexts/ReportContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ReportRequestsFilter } from "./ReportRequestFilter";
import dayjs from "dayjs";

const allColumns = [
	{
		id: 1,
		header: "Dia",
		value: "day",
	},
	{
		id: 2,
		header: "Mês",
		value: "month",
	},
];

export function Row({ period }) {
	return (
		<>
			<TableRow hover>
				<TableCell align="center">{period.date}</TableCell>
				<TableCell align="center">{0}</TableCell>
				<TableCell align="center">{period.statuses.find((e) => e.status === "A")?.total ?? 0}</TableCell>
				<TableCell align="center">{period.statuses.find((e) => e.status === "F")?.total ?? 0}</TableCell>
				<TableCell align="center">{period.statuses.find((e) => e.status === "C")?.total ?? 0}</TableCell>
			</TableRow>
		</>
	);
}

export default function ReportRequestsTable({ openFilter }) {
	const { reportRequests } = useReport();

	const { reportRequestsList, loadingReport, period, setPeriod } = useContext(ReportContext);

	const [selectedPeriod, setSelectedPeriod] = useState("current_month");
	const [dateFilter, setDateFilter] = useState({ start: dayjs().subtract(6, "day").startOf("day"), end: dayjs().endOf("day") });

	const handleChange = (event) => {
		setPeriod(event.target.value);
	};

	useEffect(() => {
		const { start, end } = dateFilter;
		reportRequests(period, start, end);
	}, [period, dateFilter]);

	return (
		<>
			<TableContainer>
				{openFilter && <ReportRequestsFilter selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} dateFilter={dateFilter} setDateFilter={setDateFilter} />}
				{/* <Grid
					container
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
						gap: 2,
						p: 2,
						alignItems: "center",
						justifyItems: "center",
					}}
				>
					<Card sx={{ width: "100%" }}></Card>
					<Card sx={{ width: "100%" }}></Card>
					<Card sx={{ width: "100%" }}></Card>
				</Grid> */}
				<Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
					<FormControl sx={{ m: 1, minWidth: 100 }}>
						<Select
							value={period}
							onChange={handleChange}
							displayEmpty
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (!selected) {
									return <Typography variant="subtitle1">Agrupar por</Typography>;
								}
								return <Typography variant="subtitle2">{period === "day" ? "Dia" : "Mês"}</Typography>;
							}}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							{allColumns.map((column) => {
								return (
									<MenuItem key={column.id} value={column.value}>
										{column.header}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</Grid>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Data</TableCell>
							<TableCell align="center">Total</TableCell>
							<TableCell align="center">Abertas</TableCell>
							<TableCell align="center">Finalizadas</TableCell>
							<TableCell align="center">Canceladas</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingReport ? (
							<Loader />
						) : reportRequestsList && reportRequestsList.length > 0 ? (
							reportRequestsList.map((periodData) => <Row key={periodData.date} period={periodData} />)
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Typography variant="h5">Nenhum registro encontrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
