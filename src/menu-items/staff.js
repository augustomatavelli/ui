// third-party
import { FormattedMessage } from "react-intl";
// assets
import { AuditOutlined } from "@ant-design/icons";
// icons
const icons = { AuditOutlined };

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const staff = {
	id: "group-staff",
	title: <FormattedMessage id="Gestão de ordens de serviço" />,
	icon: icons.IdcardOutlined,
	type: "staff",
	children: [
		{
			id: "orders",
			title: <FormattedMessage id="Monitor" />,
			type: "item",
			url: "/orders",
			icon: icons.AuditOutlined,
		},
	],
};

export default staff;
