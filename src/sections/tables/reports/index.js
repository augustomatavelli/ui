import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Collapse, IconButton, Grid, Card, FormControl, Select, MenuItem } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import useReport from "hooks/useReport";
import ReportContext from "contexts/ReportContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ReportFilter } from "./ReportFilter";
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
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow hover>
				<TableCell align="center">{period.date}</TableCell>
				<TableCell align="center">{period.totalQuantity} L</TableCell>
				<TableCell align="center">
					{Number(period.totalValue).toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					})}
				</TableCell>
				<TableCell align="center">
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{period.fuelUps && period.fuelUps.length > 0 ? (
								<Table size="small" aria-label="purchases">
									<TableHead
										sx={{
											backgroundColor: "#666666",
											"& .MuiTableRow-root": {
												"&:hover": {
													backgroundColor: "transparent",
													cursor: "default",
												},
											},
										}}
									>
										<TableRow>
											<TableCell align="center" sx={{ color: "white" }}>
												Solicitação
											</TableCell>
											<TableCell align="center" sx={{ color: "white" }}>
												Aeronave
											</TableCell>
											<TableCell align="center" sx={{ color: "white" }}>
												Quantidade
											</TableCell>
											<TableCell align="center" sx={{ color: "white" }}>
												Preço por litro
											</TableCell>
											<TableCell align="center" sx={{ color: "white" }}>
												Valor Total
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{period.fuelUps.map((fuelUp) => (
											<TableRow key={fuelUp.id_request}>
												<TableCell align="center">#{fuelUp.id_request}</TableCell>
												<TableCell align="center">{fuelUp.aircraft}</TableCell>
												<TableCell align="center">{fuelUp.quantity} L</TableCell>
												<TableCell align="center">
													{Number(fuelUp.price).toLocaleString("pt-BR", {
														style: "currency",
														currency: "BRL",
													})}
												</TableCell>
												<TableCell align="center">
													{Number(fuelUp.value).toLocaleString("pt-BR", {
														style: "currency",
														currency: "BRL",
													})}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<Typography variant="body2" color="textSecondary" sx={{ ml: 2, mb: 1 }}>
									Nenhum abastecimento detalhado para este período.
								</Typography>
							)}
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default function ReportFuelTable({ openFilter }) {
	const { reportFuel } = useReport();

	const { reportFuelList, loadingReport, period, setPeriod } = useContext(ReportContext);

	const [selectedPeriod, setSelectedPeriod] = useState("last_7_days");
	const [dateFilter, setDateFilter] = useState({ start: dayjs().subtract(6, "day").startOf("day"), end: dayjs().endOf("day") });

	const handleChange = (event) => {
		setPeriod(event.target.value);
	};

	useEffect(() => {
		const { start, end } = dateFilter;
		reportFuel(period, start, end);
	}, [period, dateFilter]);

	return (
		<>
			<TableContainer>
				{openFilter && <ReportFilter selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} dateFilter={dateFilter} setDateFilter={setDateFilter} />}
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
							<TableCell align="center">Quantidade</TableCell>
							<TableCell align="center">Valor Total</TableCell>
							<TableCell align="center" />
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingReport ? (
							<Loader />
						) : reportFuelList && reportFuelList.length > 0 ? (
							reportFuelList.map((periodData) => <Row key={periodData.date} period={periodData} />)
						) : (
							<TableRow>
								<TableCell colSpan={4} align="center">
									<Typography variant="h5">Nenhum dado encontrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
