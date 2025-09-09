import { AppstoreAddOutlined, BellOutlined } from "@ant-design/icons";

const icons = { AppstoreAddOutlined, BellOutlined };

const reports = {
	id: "group-notifications",
	title: "Notificações",
	icon: icons.AppstoreAddOutlined,
	type: "notifications",
	children: [
		{
			id: "notifications",
			title: "Minhas notificações",
			type: "item",
			url: "/notifications/me",
			icon: icons.BellOutlined,
		},
	],
};

export default reports;
