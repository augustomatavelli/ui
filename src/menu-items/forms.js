// third-party
import { FormattedMessage } from "react-intl";

// assets
import { UnorderedListOutlined, FileTextOutlined, ScheduleOutlined } from "@ant-design/icons";

// icons
const icons = {
	UnorderedListOutlined,
	FileTextOutlined,
	ScheduleOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const forms = {
	id: "group-forms",
	title: <FormattedMessage id="Usuários" />,
	icon: icons.IdcardOutlined,
	type: "user",
	children: [
		{
			id: "my aircrafts",
			title: <FormattedMessage id="Minhas aeronaves" />,
			type: "item",
			url: "/aircrafts/me",
			icon: icons.UnorderedListOutlined,
		},
		{
			id: "my request",
			title: <FormattedMessage id="Minhas solicitações" />,
			type: "item",
			url: "/requests/me",
			icon: icons.FileTextOutlined,
		},
		{
			id: "my request by aircraft",
			title: <FormattedMessage id="Solicitações de aeronaves" />,
			type: "item",
			url: "/requests/aircrafts/me",
			icon: icons.ScheduleOutlined,
		},
	],
};

export default forms;
