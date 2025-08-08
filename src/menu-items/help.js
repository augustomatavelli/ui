import { MessageOutlined } from "@ant-design/icons";
const icons = { MessageOutlined };

const help = {
	id: "group-help",
	title: "Ajuda",
	icon: icons.IdcardOutlined,
	type: "help",
	children: [
		{
			id: "help",
			title: "Contato",
			type: "item",
			url: "/contact-us",
			icon: icons.MessageOutlined,
		},
	],
};

export default help;
