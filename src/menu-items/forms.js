import { UnorderedListOutlined, FileTextOutlined, ScheduleOutlined } from "@ant-design/icons";
const icons = {
	UnorderedListOutlined,
	FileTextOutlined,
	ScheduleOutlined,
};

const forms = {
	id: "group-forms",
	title: "Minha área",
	icon: icons.IdcardOutlined,
	type: "user",
	children: [
		{
			id: "my aircrafts",
			title: "Minhas aeronaves",
			type: "item",
			url: "/aircrafts/me",
			icon: icons.UnorderedListOutlined,
		},
		{
			id: "my request",
			title: "Minhas solicitações",
			type: "item",
			url: "/requests/me",
			icon: icons.FileTextOutlined,
		},
	],
};

export default forms;
