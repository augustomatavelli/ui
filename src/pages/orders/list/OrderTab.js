import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import OrdersTable from "sections/tables/orders";
import OrderContext from "contexts/OrdersContext";
import { useContext } from "react";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const style = (theme, value, tabValue, colorKey) => ({
	color: theme.palette[colorKey].main,
	fontWeight: "bold",
	backgroundColor: value === tabValue ? theme.palette[colorKey].lighter : "transparent",
	"&.Mui-selected": {
		color: theme.palette[colorKey].main,
	},
	"&:hover": {
		color: theme.palette[colorKey].main,
		backgroundColor: "transparent",
	},
});

export default function OrdersTabs({ reload, setReload, search, setSelectedStatus, value, setValue }) {
	const { totalTabOrders, loadingOrder } = useContext(OrderContext);

	const theme = useTheme();

	const indicatorColors = [theme.palette.secondary.main, theme.palette.primary.main, theme.palette.warning.main, theme.palette.success.main, theme.palette.error.main];

	const handleChange = (event, newValue) => {
		setValue(newValue);
		switch (newValue) {
			case 0:
				setSelectedStatus({});
				break;
			case 1:
				setSelectedStatus({ P: true });
				break;
			case 2:
				setSelectedStatus({ E: true });
				break;
			case 3:
				setSelectedStatus({ F: true });
				break;
			case 4:
				setSelectedStatus({ C: true });
				break;
			default:
				break;
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: indicatorColors[value] } }} variant="scrollable">
					<Tab label={`Todas${!loadingOrder ? ` (${totalTabOrders.amount_total})` : ""}`} {...a11yProps(0)} sx={style(theme, value, 0, "secondary")} disabled={loadingOrder} />
					<Tab label={`Abertas${!loadingOrder ? ` (${totalTabOrders.amount_open})` : ""}`} {...a11yProps(1)} sx={style(theme, value, 1, "primary")} disabled={loadingOrder} />
					<Tab label={`Em execução${!loadingOrder ? ` (${totalTabOrders.amount_execution})` : ""}`} {...a11yProps(2)} sx={style(theme, value, 2, "warning")} disabled={loadingOrder} />
					<Tab label={`Finalizadas${!loadingOrder ? ` (${totalTabOrders.amount_finalized})` : ""}`} {...a11yProps(3)} sx={style(theme, value, 3, "success")} disabled={loadingOrder} />
					<Tab label={`Canceladas${!loadingOrder ? ` (${totalTabOrders.amount_canceled})` : ""}`} {...a11yProps(4)} sx={style(theme, value, 4, "error")} disabled={loadingOrder} />
				</Tabs>
			</Box>
			{[0, 1, 2, 3, 4].map((index) => (
				<CustomTabPanel key={index} value={value} index={index}>
					<OrdersTable reload={reload} setReload={setReload} search={search} tab={index} />
				</CustomTabPanel>
			))}
		</Box>
	);
}
