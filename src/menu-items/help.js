// third-party
import { FormattedMessage } from "react-intl";
// assets
import { MessageOutlined } from "@ant-design/icons";
// icons
const icons = { MessageOutlined };

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const help = {
	id: "group-help",
	title: <FormattedMessage id="Ajuda" />,
	icon: icons.IdcardOutlined,
	type: "help",
	children: [
		{
			id: "help",
			title: <FormattedMessage id="Contato" />,
			type: "item",
			url: "/contact-us",
			icon: icons.MessageOutlined,
		},
	],
};

export default help;
