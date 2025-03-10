import PropTypes from "prop-types";
import { useState } from "react";

// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import useAuth from "hooks/useAuth";

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ setOpen }) => {
	const { logout } = useAuth();

	const navigate = useNavigate();

	const handleListItemClick = () => {
		setOpen(false);
		navigate("/users/me");
	};

	return (
		<List component="nav" sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}>
			<ListItemButton onClick={handleListItemClick}>
				<ListItemIcon>
					<EditOutlined />
				</ListItemIcon>
				<ListItemText primary="Editar perfil" />
			</ListItemButton>
			<ListItemButton
				onClick={() => {
					logout();
				}}
			>
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
