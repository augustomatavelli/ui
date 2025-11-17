import {
	ClockCircleOutlined,
	IdcardOutlined,
	UserOutlined,
	EnvironmentOutlined,
	AppstoreAddOutlined,
	ToolOutlined,
	ScheduleOutlined,
	UnorderedListOutlined,
	FieldTimeOutlined,
	FolderOpenOutlined,
	CheckCircleOutlined,
	ContainerOutlined,
} from "@ant-design/icons";
const icons = {
	ClockCircleOutlined,
	IdcardOutlined,
	UserOutlined,
	EnvironmentOutlined,
	UnorderedListOutlined,
	AppstoreAddOutlined,
	ToolOutlined,
	ScheduleOutlined,
	FieldTimeOutlined,
	FolderOpenOutlined,
	CheckCircleOutlined,
	ContainerOutlined,
};

const admin = {
	id: "group-admin",
	title: "Admin",
	icon: icons.IdcardOutlined,
	type: "admin",
	children: [
		{
			id: "users",
			title: "Usuários",
			type: "item",
			url: "/users/admin",
			icon: icons.UserOutlined,
		},
		{
			id: "aircrafts",
			title: "Aeronaves",
			type: "item",
			url: "/aircrafts/admin",
			icon: icons.UnorderedListOutlined,
		},
		{
			id: "operators",
			title: "Operadores",
			type: "item",
			url: "/operators/admin",
			icon: icons.FolderOpenOutlined,
		},
		/* {
			id: "landing sites",
			title: "Helicentro",
			type: "item",
			url: "/landing-sites/admin",
			icon: icons.EnvironmentOutlined,
		}, */
		{
			id: "requests",
			title: "Solicitações",
			type: "item",
			url: "/requests/admin",
			icon: icons.ScheduleOutlined,
		},
		{
			id: "products",
			title: "Produtos",
			type: "item",
			url: "/products/admin",
			icon: icons.AppstoreAddOutlined,
		},
		{
			id: "operations",
			title: "Serviços",
			type: "item",
			url: "/operations/admin",
			icon: icons.ToolOutlined,
		},
		{
			id: "checklists",
			title: "Checklists",
			type: "item",
			url: "/checklists/admin",
			icon: icons.CheckCircleOutlined,
		} 
		{
			id: "inventory",
			title: "Controle de Estoques",
			type: "item",
			url: "/inventory/admin",
			icon: icons.ContainerOutlined,
		},,
		{
			id: "programação",
			title: "Programação",
			type: "item",
			url: "/live-requests",
			icon: icons.FieldTimeOutlined,
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
