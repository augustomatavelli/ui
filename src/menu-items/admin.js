import { FormattedMessage } from "react-intl";
import { ClockCircleOutlined, IdcardOutlined, UserAddOutlined, EnvironmentOutlined, AppstoreAddOutlined, ToolOutlined } from "@ant-design/icons";
// Ícones
const icons = {
	ClockCircleOutlined,
	IdcardOutlined,
	UserAddOutlined,
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
			id: "create user",
			title: <FormattedMessage id="Criar usuário" />,
			type: "item",
			url: "/users/create",
			icon: icons.UserAddOutlined,
		},
		{
			id: "create heliport",
			title: <FormattedMessage id="Cadastrar heliporto" />,
			type: "item",
			url: "/heliports/create",
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
