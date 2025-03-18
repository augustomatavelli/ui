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
			id: "pending-user",
			title: <FormattedMessage id="Usuários pendentes" />,
			type: "item",
			url: "/users/pending",
			icon: icons.ClockCircleOutlined,
		},
		{
			id: "pending-aircraft",
			title: <FormattedMessage id="Aeronaves pendentes" />,
			type: "item",
			url: "/aircrafts/pending",
			icon: icons.ClockCircleOutlined,
		},
		{
			id: "users",
			title: <FormattedMessage id="Usuários" />,
			type: "item",
			url: "/users/create",
			icon: icons.UserOutlined,
		},
		{
			id: "aircrafts",
			title: <FormattedMessage id="Aeronaves" />,
			type: "item",
			url: "/aircrafts/create",
			icon: icons.EnvironmentOutlined,
		},
		{
			id: "landing sites",
			title: <FormattedMessage id="Locais de pouso" />,
			type: "item",
			url: "/landing-sites/create",
			icon: icons.EnvironmentOutlined,
		},
		{
			id: "create products",
			title: <FormattedMessage id="Cadastrar produto" />,
			type: "item",
			url: "/products/create",
			icon: icons.AppstoreAddOutlined,
		},
		{
			id: "create services",
			title: <FormattedMessage id="Cadastrar serviço" />,
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
