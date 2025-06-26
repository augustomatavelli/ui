import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import Loader from "components/Loader";
import useReport from "hooks/useReport";
import ReportContext from "contexts/ReportContext";

export default function ReportFuelTable() {
	const { reportFuel } = useReport();

	const { reportFuelList, loadingReport, period, reportDateFilter } = useContext(ReportContext);

	useEffect(() => {
		const { start, end } = reportDateFilter;
		reportFuel(period, start, end);
	}, []);

	return (
		<>
			<TableContainer>
				{/* {openFilter && <ReportFilter />} */}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Data</TableCell>
							<TableCell align="center">Quantidade</TableCell>
							<TableCell align="center">Valor Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingReport ? (
							<Loader />
						) : reportFuelList && reportFuelList.length > 0 ? (
							reportFuelList.map((period) => (
								<TableRow hover key={period.date}>
									<TableCell align="center">{period.date}</TableCell>
									<TableCell align="center">{period.total} L</TableCell>
									<TableCell align="center">
										{Number(period.value).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
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
