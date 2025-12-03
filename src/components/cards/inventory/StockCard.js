import { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import MainCard from "components/MainCard";
import { subDays, format } from "date-fns";
import InventoryContext from "contexts/InventoryContext";

const barChartOptions = {
	chart: {
		type: "bar",
		height: 200,
		toolbar: {
			show: false,
		},
	},
	title: {
		text: "Quantidade no Estoque",
		align: "left",
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

const StockCard = () => {
	const { stockHistory } = useContext(InventoryContext);
	console.log(stockHistory);
	const theme = useTheme();
	const { primary, secondary } = theme.palette.text;
	const info = theme.palette.info.light;
	const error = theme.palette.error.light;

	const [series, setSeries] = useState([]);
	const [options, setOptions] = useState(barChartOptions);

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
					<ReactApexChart options={options} series={series} type="bar" height={225} />
				</MainCard>
			</Grid>
		</Grid>
	);
};

StockCard.propTypes = {};

export default StockCard;
