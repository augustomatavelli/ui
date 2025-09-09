import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery, Box, Container, Toolbar } from "@mui/material";
import Drawer from "./Drawer";
import Header from "./Header";
import Footer from "./Footer";
import HorizontalBar from "./Drawer/HorizontalBar";
import Breadcrumbs from "components/@extended/Breadcrumbs";
import { MenuOrientation } from "config";
import navigation from "menu-items";
import useConfig from "hooks/useConfig";
import { dispatch } from "store";
import { openDrawer } from "store/reducers/menu";
import useUser from "hooks/useUser";
import useNotification from "hooks/useNotification";

const MainLayout = () => {
	const { findOneUser } = useUser();
	const { findAllNotifications } = useNotification();

	const theme = useTheme();
	const matchDownXL = useMediaQuery(theme.breakpoints.down("xl"));
	const downLG = useMediaQuery(theme.breakpoints.down("lg"));
	const location = useLocation();

	const { container, miniDrawer, menuOrientation } = useConfig();

	const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

	const shouldShowBreadcrumbs = location.pathname.includes("/aircrafts/me");

	// set media wise responsive drawer
	useEffect(() => {
		if (!miniDrawer) {
			dispatch(openDrawer(!matchDownXL));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matchDownXL]);

	useEffect(() => {
		findOneUser();
		findAllNotifications(1, "T", true);

		const intervalId = setInterval(
			() => {
				findAllNotifications(1, "T", true);
			},
			5 * 60 * 1000
		);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<Box sx={{ display: "flex", width: "100%" }}>
			<Header />
			{!isHorizontal ? <Drawer /> : <HorizontalBar />}
			<Box component="main" sx={{ width: "calc(100% - 260px)", flexGrow: 1, p: { xs: 2, sm: 3 } }}>
				<Toolbar sx={{ mt: isHorizontal ? 8 : "inherit" }} />
				<Container
					maxWidth={container ? "xl" : false}
					sx={{
						...(container && { px: { xs: 0, sm: 2 } }),
						position: "relative",
						minHeight: "calc(100vh - 110px)",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{shouldShowBreadcrumbs && <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />}
					<Outlet />
					{/* <Footer /> */}
				</Container>
			</Box>
		</Box>
	);
};

export default MainLayout;
