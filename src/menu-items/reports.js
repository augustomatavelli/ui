// third-party
import { FormattedMessage } from "react-intl";

// assets
import { AppstoreAddOutlined } from "@ant-design/icons";

// icons
const icons = {
	AppstoreAddOutlined,
};
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const reports = {
	id: "reports",
	title: <FormattedMessage id="Relatórios" />,
	icon: icons.AppstoreAddOutlined,
	type: "reports",
	children: [],
};

export default reports;
