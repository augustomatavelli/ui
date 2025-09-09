import { AppstoreAddOutlined, SearchOutlined } from "@ant-design/icons";

const icons = { AppstoreAddOutlined, SearchOutlined };

const logs = {
	id: "group-logs",
	title: "Auditoria",
	icon: icons.AppstoreAddOutlined,
	type: "logs",
	children: [
		{
			id: "logs",
			title: "Logs",
			type: "item",
			url: "/logs/admin",
			icon: icons.SearchOutlined,
		},
	],
};

export default logs;
