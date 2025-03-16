// third-party
import { FormattedMessage } from "react-intl";

// assets
import { UnorderedListOutlined, UserAddOutlined } from "@ant-design/icons";

// icons
const icons = {
	UnorderedListOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const forms = {
	id: "group-forms",
	title: <FormattedMessage id="Geral" />,
	icon: icons.IdcardOutlined,
	type: "group",
	children: [
		{
			id: "my aircrafts",
			title: <FormattedMessage id="Minhas Aeronaves" />,
			type: "item",
			url: "/aircrafts/me",
			icon: icons.UnorderedListOutlined,
		},
	],
};

export default forms;
