// third-party
import { FormattedMessage } from "react-intl";

// assets
import { LineChartOutlined, IdcardOutlined, DatabaseOutlined, UnorderedListOutlined } from "@ant-design/icons";

// icons
const icons = {
	LineChartOutlined,
	UnorderedListOutlined,
	DatabaseOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
	id: "group-widget",
	title: <FormattedMessage id="Formulários" />,
	icon: icons.IdcardOutlined,
	type: "group",
	children: [
		{
			id: "my helicopters",
			title: <FormattedMessage id="Meus helicópteros" />,
			type: "item",
			url: "/helicopters/me",
			icon: icons.UnorderedListOutlined,
		},
		{
			id: "data",
			title: <FormattedMessage id="data" />,
			type: "item",
			url: "/widget/data",
			icon: icons.DatabaseOutlined,
		},
		{
			id: "chart",
			title: <FormattedMessage id="chart" />,
			type: "item",
			url: "/widget/chart",
			icon: icons.LineChartOutlined,
		},
	],
};

export default widget;
