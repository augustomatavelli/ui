// third-party
import { FormattedMessage } from "react-intl";

// assets
import { ClockCircleOutlined } from "@ant-design/icons";
// icons
const icons = {
	ClockCircleOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const admin = {
	id: "group-admin",
	title: <FormattedMessage id="Admin" />,
	icon: icons.IdcardOutlined,
	type: "group",
	children: [
		{
			id: "pending-user",
			title: <FormattedMessage id="Usuários pendentes" />,
			type: "item",
			url: "/users/pending",
			icon: icons.ClockCircleOutlined,
		},
		{
			id: "pending-aircraft",
			title: <FormattedMessage id="Aeronaves pendentes" />,
			type: "item",
			url: "/aircrafts/pending",
			icon: icons.ClockCircleOutlined,
		},
	],
};

export default admin;
