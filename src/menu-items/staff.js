import { AuditOutlined, FileTextOutlined } from "@ant-design/icons";
const icons = { AuditOutlined, FileTextOutlined };

const staff = {
	id: "group-staff",
	title: "Painel de Operações",
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
		{
			id: "controle landing-takeoff",
			title: "Controle de Pouso/Decolagem",
			type: "item",
			url: "/requests/control-event",
			icon: icons.FileTextOutlined,
		},
	],
};

export default staff;
