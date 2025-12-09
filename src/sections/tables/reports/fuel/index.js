import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Collapse, IconButton, Grid, Card, FormControl, Select, MenuItem, TableFooter, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import useReport from "hooks/useReport";
import ReportContext from "contexts/ReportContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { FilePdfOutlined, BarChartOutlined, TableOutlined } from "@ant-design/icons";
import { ReportFuelFilter } from "./ReportFuelFilter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import ReactApexChart from "react-apexcharts";
dayjs.extend(utc);
dayjs.extend(timezone);

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

function FuelBarChart({ data }) {
	const categories = data.map((item) => item.date);
	const quantities = data.map((item) => item.totalQuantity);
	const values = data.map((item) => item.totalValue);

	const chartOptions = {
		chart: {
			type: "bar",
			height: 430,
			toolbar: {
				show: true,
			},
		},
		plotOptions: {
			bar: {
				columnWidth: "50%",
				borderRadiusApplication: "end",
				borderRadiusWhenStacked: "last",
				dataLabels: {
					position: "top",
				},
			},
		},
		dataLabels: {
			enabled: true,
			offsetY: -20,
			style: {
				fontSize: "11px",
				colors: ["#304758"],
				fontWeight: "bold",
			},
			formatter: function (val, opts) {
				const seriesName = opts.w.config.series[opts.seriesIndex].name;
				if (seriesName === "Quantidade") {
					return val.toFixed(0) + " L";
				} else if (seriesName === "Valor Total") {
					return val.toLocaleString("pt-BR", {
						style: "currency",
						currency: "BRL",
					});
				}
				return val;
			},
		},
		stroke: {
			show: true,
			width: 2,
			colors: ["transparent"],
		},
		xaxis: {
			categories: categories,
		},
		yaxis: [
			{
				title: {
					text: "Quantidade (L)",
				},
				labels: {
					formatter: function (val) {
						return val.toFixed(0) + " L";
					},
				},
			},
			{
				opposite: true,
				title: {
					text: "Valor Total (R$)",
				},
				labels: {
					formatter: function (val) {
						return val.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						});
					},
				},
			},
		],
		fill: {
			opacity: 1,
		},
		tooltip: {
			y: [
				{
					formatter: function (val) {
						return val + " L";
					},
				},
				{
					formatter: function (val) {
						return val.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						});
					},
				},
			],
		},
		legend: {
			position: "bottom",
			horizontalAlign: "center",
		},
		colors: ["#00E396", "#008FFB"],
	};

	const series = [
		{
			name: "Quantidade",
			data: quantities,
		},
		{
			name: "Valor Total",
			data: values,
		},
	];

	return (
		<Card sx={{ p: 2, mt: 2 }}>
			<ReactApexChart options={chartOptions} series={series} type="bar" height={430} />
		</Card>
	);
}

export default function ReportFuelTable({ openFilter, reload }) {
	const { reportFuel } = useReport();

	const { reportFuelList, loadingReport, period, setPeriod, reportTotalFuelList } = useContext(ReportContext);

	const [selectedPeriod, setSelectedPeriod] = useState("general");
	const [dateFilter, setDateFilter] = useState({
		start: dayjs("2025-01-01").startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
		end: dayjs().endOf("year").format("YYYY-MM-DDTHH:mm:ss"),
	});
	const [graph, setGraph] = useState(false);

	const handleChange = (event) => {
		setPeriod(event.target.value);
	};

	const handleToggleGraph = (showGraph) => {
		setGraph(showGraph);
		if (showGraph) {
			setPeriod("month");
		}
	};

	useEffect(() => {
		const { start, end } = dateFilter;
		reportFuel(period, start, end);
	}, [period, dateFilter, reload]);

	return (
		<>
			<TableContainer>
				{openFilter && <ReportFuelFilter selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} dateFilter={dateFilter} setDateFilter={setDateFilter} />}
				<Grid sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", px: 1 }}>
					{!graph ? (
						<>
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
							<IconButton color="inherit" variant="outlined" sx={{ height: "40px" }} onClick={() => handleToggleGraph(true)}>
								<BarChartOutlined />
							</IconButton>
						</>
					) : (
						<IconButton color="inherit" variant="outlined" sx={{ height: "40px", m: 1 }} onClick={() => handleToggleGraph(false)}>
							<TableOutlined />
						</IconButton>
					)}
				</Grid>
				{graph ? (
					loadingReport ? (
						<Loader />
					) : (
						<FuelBarChart data={reportFuelList || []} />
					)
				) : (
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
								<TableRow>
									<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
										<Loader />
									</TableCell>
								</TableRow>
							) : reportFuelList && reportFuelList.length > 0 ? (
								reportFuelList.map((periodData) => <Row key={periodData.date} period={periodData} />)
							) : (
								<TableRow>
									<TableCell colSpan={4} align="center">
										<Typography variant="h5">Nenhum registro encontrado</Typography>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
						{!loadingReport && (
							<TableFooter>
								<TableRow>
									<TableCell />
									<TableCell align="center">Total: {reportTotalFuelList?.totalAmount ? reportTotalFuelList.totalAmount : 0} L</TableCell>
									<TableCell align="center">
										Total:{" "}
										{Number(reportTotalFuelList?.totalValue ? reportTotalFuelList.totalValue : 0).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</TableCell>
									<TableCell />
								</TableRow>
							</TableFooter>
						)}
					</Table>
				)}
			</TableContainer>
		</>
	);
}
