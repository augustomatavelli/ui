import { FormattedMessage } from "react-intl";
import { ClockCircleOutlined, IdcardOutlined } from "@ant-design/icons";
import { useContext } from "react";
import UserContext from "contexts/UserContext";

// Ícones
const icons = {
	ClockCircleOutlined,
	IdcardOutlined,
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
