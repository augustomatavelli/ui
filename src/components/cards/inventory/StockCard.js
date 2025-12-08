import { useContext, useEffect, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid, Box, Typography, IconButton } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import MainCard from "components/MainCard";
import { format } from "date-fns";
import InventoryContext from "contexts/InventoryContext";
import { Document, Page, StyleSheet, pdf, Image } from "@react-pdf/renderer";
import { FilePdfOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";

const pdfStyles = StyleSheet.create({
	page: {
		padding: 30,
		fontSize: 12,
	},
	title: {
		fontSize: 18,
		marginBottom: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	chartImage: {
		marginTop: 20,
		width: "100%",
		height: "auto",
	},
});

const barChartOptions = {
	chart: {
		type: "bar",
		height: 200,
		toolbar: {
			show: false,
		},
	},
	responsive: [
		{
			breakpoint: 480,
		},
	],
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
			fontSize: "12px",
			colors: ["#304758"],
		},
	},
	xaxis: {
		axisBorder: {
			show: true,
		},
		axisTicks: {
			show: true,
		},
	},
	yaxis: {
		show: true,
	},
	grid: {
		show: false,
	},
};

const StockCard = ({ serviceName }) => {
	const { stockHistory } = useContext(InventoryContext);

	const theme = useTheme();
	const { primary, secondary } = theme.palette.text;
	const info = theme.palette.info.light;
	const error = theme.palette.error.light;

	const [series, setSeries] = useState([]);
	const [options, setOptions] = useState(barChartOptions);
	const chartRef = useRef();

	const handleGeneratePDF = async () => {
		if (!chartRef.current) return;

		const canvas = await html2canvas(chartRef.current, {
			scale: 2,
			backgroundColor: "#ffffff",
		});
		const imgData = canvas.toDataURL("image/png");

		const MyDocument = (
			<Document>
				<Page size="A4" style={pdfStyles.page}>
					<Image src={imgData} style={pdfStyles.chartImage} />
				</Page>
			</Document>
		);

		const blob = await pdf(MyDocument).toBlob();
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `estoque-${serviceName}.pdf`;
		link.click();
		URL.revokeObjectURL(url);
	};

	useEffect(() => {
		if (stockHistory && stockHistory.length > 0) {
			const categories = stockHistory.map((item) => {
				const [year, month, day] = item.date.split("-");
				return format(new Date(year, month - 1, day), "dd/MM");
			});
			const data = stockHistory.map((item) => item.total);

			setSeries([
				{
					name: "Estoque",
					data: data,
				},
			]);

			setOptions((prevState) => ({
				...prevState,
				colors: [info],
				plotOptions: {
					...prevState.plotOptions,
					bar: {
						...prevState.plotOptions.bar,
						colors: {
							ranges: [
								{
									from: -Infinity,
									to: -1,
									color: error,
								},
								{
									from: 0,
									to: Infinity,
									color: info,
								},
							],
						},
					},
				},
				xaxis: {
					...prevState.xaxis,
					categories: categories,
					labels: {
						style: {
							colors: categories.map(() => secondary),
						},
					},
				},
				tooltip: {
					theme: "light",
				},
			}));
		}
	}, [stockHistory, primary, info, secondary, error]);

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<MainCard>
					<div ref={chartRef}>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="h5">Estoque - {serviceName}</Typography>
							<IconButton onClick={handleGeneratePDF}>
								<FilePdfOutlined />
							</IconButton>
						</Box>
						<ReactApexChart options={options} series={series} type="bar" height={225} />
					</div>
				</MainCard>
			</Grid>
		</Grid>
	);
};

StockCard.propTypes = {};

export default StockCard;
