import { FormattedMessage } from "react-intl";
import { ClockCircleOutlined, IdcardOutlined, UserAddOutlined } from "@ant-design/icons";
import { useContext } from "react";
import UserContext from "contexts/UserContext";

// Ícones
const icons = {
	ClockCircleOutlined,
	IdcardOutlined,
	UserAddOutlined,
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
