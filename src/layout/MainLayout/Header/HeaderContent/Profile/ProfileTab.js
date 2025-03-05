import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};

	return (
		<List component="nav" sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}>
			<ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
				<ListItemIcon>
					<EditOutlined />
				</ListItemIcon>
				<ListItemText primary="Editar perfil" />
			</ListItemButton>
			<ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
				<ListItemIcon>
					<LogoutOutlined />
				</ListItemIcon>
				<ListItemText primary="Logout" />
			</ListItemButton>
		</List>
	);
};

ProfileTab.propTypes = {
	handleLogout: PropTypes.func,
};

export default ProfileTab;
