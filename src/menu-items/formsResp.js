import { UnorderedListOutlined, FileTextOutlined, ScheduleOutlined } from "@ant-design/icons";
const icons = {
	UnorderedListOutlined,
	FileTextOutlined,
	ScheduleOutlined,
};

const formsResp = {
	id: "group-formsResp",
	title: "Minha área",
	icon: icons.IdcardOutlined,
	type: "userResp",
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
		{
			id: "my request by aircraft",
			title: "Solicitações de aeronaves",
			type: "item",
			url: "/requests/my-aircrafts",
			icon: icons.ScheduleOutlined,
		},
	],
};

export default formsResp;
