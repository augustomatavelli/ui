import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import { Menu } from "menu-items/dashboard";
import { useSelector } from "store";
import useConfig from "hooks/useConfig";
import { HORIZONTAL_MAX_ITEM, MenuOrientation } from "config";
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import UserContext from "contexts/UserContext";

const Navigation = () => {
	const { user } = useContext(UserContext);

	const theme = useTheme();
	const downLG = useMediaQuery(theme.breakpoints.down("lg"));

	const { menuOrientation } = useConfig();
	const { drawerOpen } = useSelector((state) => state.menu);
	const [selectedItems, setSelectedItems] = useState("");
	const [selectedLevel, setSelectedLevel] = useState(0);
	const [menuItems, setMenuItems] = useState({ items: [] });

	useEffect(() => {
		handlerMenuItem();
		// eslint-disable-next-line
	}, [user]);

	const getMenu = Menu();

	const handlerMenuItem = () => {
		const filteredItems = menuItem.items.filter((item) => {
			if (item.id === "group-dashboard") {
				return true;
			}
			if (item.id === "group-admin" && user.type !== "A" && user.type !== "S") {
				return false;
			}
			return true;
		});

		if (getMenu?.id !== undefined && !filteredItems.some((item) => item.id === getMenu.id)) {
			filteredItems.splice(0, 0, getMenu);
		}

		setMenuItems({ items: filteredItems });
	};

	useLayoutEffect(() => {
		setMenuItems(menuItem);
		// eslint-disable-next-line
	}, [menuItem]);

	const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

	const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
	let lastItemIndex = menuItems.items.length - 1;
	let remItems = [];
	let lastItemId;

	// Verifica se o número de itens excede o limite horizontal e ajusta o menu
	if (lastItem && lastItem < menuItems.items.length) {
		lastItemId = menuItems.items[lastItem - 1].id;
		lastItemIndex = lastItem - 1;
		remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
			title: item.title,
			elements: item.children,
			icon: item.icon,
		}));
	}

	const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
		if (item.type === "help") {
			return (
				<NavGroup
					key={item.id}
					setSelectedItems={setSelectedItems}
					setSelectedLevel={setSelectedLevel}
					selectedLevel={selectedLevel}
					selectedItems={selectedItems}
					lastItem={lastItem}
					remItems={remItems}
					lastItemId={lastItemId}
					item={item}
				/>
			);
		}

		switch (user.type) {
			case "S":
				return (
					<NavGroup
						key={item.id}
						setSelectedItems={setSelectedItems}
						setSelectedLevel={setSelectedLevel}
						selectedLevel={selectedLevel}
						selectedItems={selectedItems}
						lastItem={lastItem}
						remItems={remItems}
						lastItemId={lastItemId}
						item={item}
					/>
				);
				break;
			case "A":
				if (item.type === "admin" || item.type === "staff" || item.type === "reports" || item.type === "user") {
					return (
						<NavGroup
							key={item.id}
							setSelectedItems={setSelectedItems}
							setSelectedLevel={setSelectedLevel}
							selectedLevel={selectedLevel}
							selectedItems={selectedItems}
							lastItem={lastItem}
							remItems={remItems}
							lastItemId={lastItemId}
							item={item}
						/>
					);
				}
				break;
			case "P":
				if (item.type === "user") {
					return (
						<NavGroup
							key={item.id}
							setSelectedItems={setSelectedItems}
							setSelectedLevel={setSelectedLevel}
							selectedLevel={selectedLevel}
							selectedItems={selectedItems}
							lastItem={lastItem}
							remItems={remItems}
							lastItemId={lastItemId}
							item={item}
						/>
					);
				}
				break;
			case "O":
				if (item.type === "userResp") {
					return (
						<NavGroup
							key={item.id}
							setSelectedItems={setSelectedItems}
							setSelectedLevel={setSelectedLevel}
							selectedLevel={selectedLevel}
							selectedItems={selectedItems}
							lastItem={lastItem}
							remItems={remItems}
							lastItemId={lastItemId}
							item={item}
						/>
					);
				}
				break;
			case "C":
				if (item.type === "staff") {
					return (
						<NavGroup
							key={item.id}
							setSelectedItems={setSelectedItems}
							setSelectedLevel={setSelectedLevel}
							selectedLevel={selectedLevel}
							selectedItems={selectedItems}
							lastItem={lastItem}
							remItems={remItems}
							lastItemId={lastItemId}
							item={item}
						/>
					);
				}
				break;
		}
	});

	return (
		<Box
			sx={{
				pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
				"& > ul:first-of-type": { mt: 0 },
				display: isHorizontal ? { xs: "block", lg: "flex" } : "block",
			}}
		>
			{navGroups}
		</Box>
	);
};

export default Navigation;
