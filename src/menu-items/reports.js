import { FormattedMessage } from "react-intl";
import { AppstoreAddOutlined, BarChartOutlined, LineChartOutlined } from "@ant-design/icons";

const icons = { AppstoreAddOutlined, BarChartOutlined, LineChartOutlined };

const reports = {
	id: "group-reports",
	title: <FormattedMessage id="Relatórios" />,
	icon: icons.AppstoreAddOutlined,
	type: "reports",
	children: [
		{
			id: "fuel",
			title: <FormattedMessage id="Combustível" />,
			type: "item",
			url: "/reports/fuel",
			icon: icons.LineChartOutlined,
		},
		{
			id: "requests",
			title: <FormattedMessage id="Solicitações" />,
			type: "item",
			url: "/reports/requests",
			icon: icons.BarChartOutlined,
		},
	],
};

export default reports;
