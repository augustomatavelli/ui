import { FormattedMessage } from "react-intl";
import { ClockCircleOutlined, IdcardOutlined, UserOutlined, EnvironmentOutlined, AppstoreAddOutlined, ToolOutlined } from "@ant-design/icons";
// Ícones
const icons = {
	ClockCircleOutlined,
	IdcardOutlined,
	UserOutlined,
	EnvironmentOutlined,
	AppstoreAddOutlined,
	ToolOutlined,
};

const admin = {
	id: "group-admin",
	title: <FormattedMessage id="Admin" />,
	icon: icons.IdcardOutlined,
	type: "group",
	children: [
		{
			id: "users",
			title: <FormattedMessage id="Usuários" />,
			type: "item",
			url: "/users/admin",
			icon: icons.UserOutlined,
		},
		{
			id: "aircrafts",
			title: <FormattedMessage id="Aeronaves" />,
			type: "item",
			url: "/aircrafts/admin",
			icon: icons.EnvironmentOutlined,
		},
		{
			id: "landing sites",
			title: <FormattedMessage id="Aeródromos" />,
			type: "item",
			url: "/landing-sites/admin",
			icon: icons.EnvironmentOutlined,
		},
		{
			id: "create products",
			title: <FormattedMessage id="Produtos" />,
			type: "item",
			url: "/products/create",
			icon: icons.AppstoreAddOutlined,
		},
		{
			id: "create services",
			title: <FormattedMessage id="Serviços" />,
			type: "item",
			url: "/services/create",
			icon: icons.ToolOutlined,
		},
	],
};

export default admin;

/* const useMenuAdmin = () => {
	const { user } = useContext(UserContext);

	if (user && user.type !== "A") {
		return {
			...admin,
			children: [],
		};
	}

	return admin;
};

export default useMenuAdmin; */
