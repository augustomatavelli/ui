import { AppstoreAddOutlined, BarChartOutlined, LineChartOutlined } from "@ant-design/icons";

const icons = { AppstoreAddOutlined, BarChartOutlined, LineChartOutlined };

const reports = {
	id: "group-reports",
	title: "Relatórios",
	icon: icons.AppstoreAddOutlined,
	type: "reports",
	children: [
		{
			id: "reportFuel",
			title: "Combustível",
			type: "item",
			url: "/reports/fuel",
			icon: icons.LineChartOutlined,
		},
		{
			id: "reportRequests",
			title: "Solicitações",
			type: "item",
			url: "/reports/requests",
			icon: icons.BarChartOutlined,
		},
	],
};

export default reports;
