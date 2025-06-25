import { FormattedMessage } from "react-intl";
import { AppstoreAddOutlined, BarChartOutlined } from "@ant-design/icons";

const icons = { AppstoreAddOutlined, BarChartOutlined };

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
			icon: icons.BarChartOutlined,
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
