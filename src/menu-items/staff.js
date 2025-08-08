import { AuditOutlined } from "@ant-design/icons";
const icons = { AuditOutlined };

const staff = {
	id: "group-staff",
	title: "Gestão de ordens de serviço",
	icon: icons.IdcardOutlined,
	type: "staff",
	children: [
		{
			id: "orders",
			title: "Monitor",
			type: "item",
			url: "/orders",
			icon: icons.AuditOutlined,
		},
	],
};

export default staff;
