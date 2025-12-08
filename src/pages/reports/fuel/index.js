import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReportFuelTable from "sections/tables/reports/fuel";
import { FilterOutlined, FilterFilled, ReloadOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Grid } from "@mui/material";
import ReportContext from "contexts/ReportContext";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
	page: {
		padding: 30,
		fontSize: 10,
		fontFamily: "Helvetica",
	},
	title: {
		fontSize: 18,
		marginBottom: 20,
		textAlign: "center",
		fontWeight: "bold",
	},
	table: {
		display: "table",
		width: "auto",
		marginBottom: 20,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		borderBottomStyle: "solid",
		minHeight: 30,
		alignItems: "center",
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		borderBottomWidth: 2,
		borderBottomColor: "#333",
		borderBottomStyle: "solid",
		minHeight: 35,
		alignItems: "center",
		fontWeight: "bold",
	},
	tableColDate: {
		width: "30%",
		padding: 8,
		textAlign: "center",
	},
	tableColQuantity: {
		width: "25%",
		padding: 8,
		textAlign: "center",
	},
	tableColValue: {
		width: "25%",
		padding: 8,
		textAlign: "center",
	},
	tableColDetails: {
		width: "20%",
		padding: 8,
		textAlign: "center",
	},
	headerText: {
		fontWeight: "bold",
		fontSize: 11,
	},
	detailsSection: {
		marginTop: 10,
		marginBottom: 15,
		paddingLeft: 20,
		borderLeftWidth: 3,
		borderLeftColor: "#666",
		borderLeftStyle: "solid",
	},
	detailsTitle: {
		fontSize: 10,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#333",
	},
	detailsTable: {
		display: "table",
		width: "auto",
		marginTop: 5,
	},
	detailsHeader: {
		flexDirection: "row",
		backgroundColor: "#666",
		minHeight: 25,
		alignItems: "center",
	},
	detailsRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		borderBottomStyle: "solid",
		minHeight: 25,
		alignItems: "center",
	},
	detailsColRequest: {
		width: "15%",
		padding: 5,
		textAlign: "center",
		fontSize: 9,
	},
	detailsColAircraft: {
		width: "25%",
		padding: 5,
		textAlign: "center",
		fontSize: 9,
	},
	detailsColQuantity: {
		width: "20%",
		padding: 5,
		textAlign: "center",
		fontSize: 9,
	},
	detailsColPrice: {
		width: "20%",
		padding: 5,
		textAlign: "center",
		fontSize: 9,
	},
	detailsColTotal: {
		width: "20%",
		padding: 5,
		textAlign: "center",
		fontSize: 9,
	},
	headerTextWhite: {
		color: "white",
		fontWeight: "bold",
		fontSize: 9,
	},
	footer: {
		flexDirection: "row",
		backgroundColor: "#f0f0f0",
		borderTopWidth: 2,
		borderTopColor: "#333",
		borderTopStyle: "solid",
		minHeight: 35,
		alignItems: "center",
		fontWeight: "bold",
		marginTop: 10,
	},
	footerText: {
		fontWeight: "bold",
		fontSize: 11,
	},
});

const ReportFuelPeriod = () => {
	const { user } = useContext(UserContext);
	const { reportFuelListPDF } = useContext(ReportContext);

	const [openFilter, setOpenFilter] = useState(false);
	const [reload, setReload] = useState(false);

	const navigate = useNavigate();

	const handleGeneratePDF = async () => {
		if (!reportFuelListPDF || reportFuelListPDF.length === 0) {
			console.warn("Nenhum dado disponível para gerar o PDF");
			return;
		}

		const MyDocument = (
			<Document>
				<Page size="A4" style={pdfStyles.page}>
					<Text style={pdfStyles.title}>Relatório de Combustível</Text>

					<View style={pdfStyles.table}>
						<View style={pdfStyles.tableHeader}>
							<Text style={[pdfStyles.tableColDate, pdfStyles.headerText]}>Data</Text>
							<Text style={[pdfStyles.tableColDetails, pdfStyles.headerText]}>Solicitação</Text>
							<Text style={[pdfStyles.tableColDetails, pdfStyles.headerText]}>Matrícula</Text>
							<Text style={[pdfStyles.tableColQuantity, pdfStyles.headerText]}>Quantidade</Text>
							<Text style={[pdfStyles.tableColValue, pdfStyles.headerText]}>Valor Total</Text>
						</View>

						{reportFuelListPDF.map((period, index) => (
							<View key={index}>
								<View style={pdfStyles.tableRow}>
									<Text style={pdfStyles.tableColDate}>{period.finalized_at}</Text>
									<Text style={pdfStyles.tableColDetails}>#{period.id_request}</Text>
									<Text style={pdfStyles.tableColDetails}>{period.registration}</Text>
									<Text style={pdfStyles.tableColQuantity}>{period.amount} L</Text>
									<Text style={pdfStyles.tableColValue}>
										{Number(period.value).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
										})}
									</Text>
								</View>
							</View>
						))}
					</View>
				</Page>
			</Document>
		);

		const blob = await pdf(MyDocument).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `relatorio-combustivel-${new Date().toISOString().split("T")[0]}.pdf`;
		link.click();
		URL.revokeObjectURL(url);
	};

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Relatório Combustível"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Button
						color="inherit"
						variant={openFilter ? "contained" : "outlined"}
						sx={{
							minWidth: 50,
							width: "fit-content",
							padding: 1,
						}}
						onClick={() => {
							setOpenFilter(!openFilter);
						}}
					>
						{openFilter ? <FilterFilled style={{ fontSize: 18 }} /> : <FilterOutlined style={{ fontSize: 18 }} />}
					</Button>
					<Button
						color="inherit"
						variant="outlined"
						sx={{
							minWidth: 50,
							width: "fit-content",
							padding: 1,
						}}
						onClick={() => setReload(!reload)}
					>
						<ReloadOutlined style={{ fontSize: 18 }} />
					</Button>
					<Button
						color="inherit"
						variant="outlined"
						sx={{
							minWidth: 50,
							width: "fit-content",
							padding: 1,
						}}
						onClick={handleGeneratePDF}
					>
						<FilePdfOutlined style={{ fontSize: 18 }} />
					</Button>
				</Grid>
			}
		>
			<ReportFuelTable openFilter={openFilter} reload={reload} />
		</MainCard>
	);
};

export default ReportFuelPeriod;
