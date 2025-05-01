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

export default function OrdersTabs({ reload, setReload, search, setSelectedStatus, value, setValue }) {
	const { totalTabOrders } = useContext(OrderContext);

	const theme = useTheme();

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
				<Tabs
					value={value}
					onChange={handleChange}
					TabIndicatorProps={{
						style: {
							backgroundColor:
								value === 0
									? theme.palette.secondary.main
									: value === 1
										? theme.palette.primary.main
										: value === 2
											? theme.palette.warning.main
											: value === 3
												? theme.palette.success.main
												: theme.palette.error.main,
						},
					}}
					variant="scrollable"
				>
					<Tab
						label={`Todas (${totalTabOrders.amount_total})`}
						{...a11yProps(0)}
						sx={{
							color: theme.palette.secondary.main,
							fontWeight: "bold",
							backgroundColor: value === 0 ? theme.palette.secondary.lighter : "transparent",
							"&.Mui-selected": {
								color: theme.palette.secondary.main,
							},
							"&:hover": {
								color: theme.palette.secondary.main,
								backgroundColor: "transparent",
							},
						}}
					/>

					<Tab
						label={`Abertas (${totalTabOrders.amount_open})`}
						{...a11yProps(1)}
						sx={{
							color: theme.palette.primary.main,
							fontWeight: "bold",
							backgroundColor: value === 1 ? theme.palette.primary.lighter : "transparent",
							"&.Mui-selected": {
								color: theme.palette.primary.main,
							},
							"&:hover": {
								color: theme.palette.primary.main,
								backgroundColor: "transparent",
							},
						}}
					/>
					<Tab
						label={`Em execução (${totalTabOrders.amount_execution})`}
						{...a11yProps(2)}
						sx={{
							color: theme.palette.warning.main,
							fontWeight: "bold",
							backgroundColor: value === 2 ? theme.palette.warning.lighter : "transparent",
							"&.Mui-selected": {
								color: theme.palette.warning.main,
							},
							"&:hover": {
								color: theme.palette.warning.main,
								backgroundColor: "transparent",
							},
						}}
					/>
					<Tab
						label={`Finalizadas (${totalTabOrders.amount_finalized})`}
						{...a11yProps(3)}
						sx={{
							color: theme.palette.success.main,
							fontWeight: "bold",
							backgroundColor: value === 3 ? theme.palette.success.lighter : "transparent",
							"&.Mui-selected": {
								color: theme.palette.success.main,
							},
							"&:hover": {
								color: theme.palette.success.main,
								backgroundColor: "transparent",
							},
						}}
					/>
					<Tab
						label={`Canceladas (${totalTabOrders.amount_canceled})`}
						{...a11yProps(4)}
						sx={{
							color: theme.palette.error.main,
							fontWeight: "bold",
							backgroundColor: value === 4 ? theme.palette.error.lighter : "transparent",
							"&.Mui-selected": {
								color: theme.palette.error.main,
							},
							"&:hover": {
								color: theme.palette.error.main,
								backgroundColor: "transparent",
							},
						}}
					/>
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<OrdersTable reload={reload} setReload={setReload} search={search} tab={0} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<OrdersTable reload={reload} setReload={setReload} search={search} tab={1} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<OrdersTable reload={reload} setReload={setReload} search={search} tab={2} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={3}>
				<OrdersTable reload={reload} setReload={setReload} search={search} tab={3} />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={4}>
				<OrdersTable reload={reload} setReload={setReload} search={search} tab={4} />
			</CustomTabPanel>
		</Box>
	);
}
