// third-party
import { FormattedMessage } from "react-intl";

// assets
import { UnorderedListOutlined } from "@ant-design/icons";

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
			id: "my helicopters",
			title: <FormattedMessage id="Meus helicópteros" />,
			type: "item",
			url: "/helicopters/me",
			icon: icons.UnorderedListOutlined,
		},
	],
};

export default forms;
