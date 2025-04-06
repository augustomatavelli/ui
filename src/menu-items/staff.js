// third-party
import { FormattedMessage } from "react-intl";
// assets
import { AuditOutlined } from "@ant-design/icons";
// icons
const icons = { AuditOutlined };

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const staff = {
	id: "group-staff",
	title: <FormattedMessage id="Gestão de tarefas" />,
	icon: icons.IdcardOutlined,
	type: "staff",
	children: [
		{
			id: "tasks",
			title: <FormattedMessage id="Tarefas" />,
			type: "item",
			url: "/tasks",
			icon: icons.AuditOutlined,
		},
	],
};

export default staff;
