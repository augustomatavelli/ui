import { useContext, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Badge, Box, ClickAwayListener, Divider, List, ListItemButton, ListItemText, Paper, Popper, Tooltip, Typography, useMediaQuery } from "@mui/material";
import MainCard from "components/MainCard";
import IconButton from "components/@extended/IconButton";
import Transitions from "components/@extended/Transitions";
import { BellOutlined, CheckCircleOutlined } from "@ant-design/icons";
import NotificationContext from "contexts/NotificationContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import useNotification from "hooks/useNotification";
import { useNavigate } from "react-router";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const avatarSX = {
	width: 36,
	height: 36,
	fontSize: "1rem",
};

const actionSX = {
	mt: "6px",
	ml: 1,
	top: "auto",
	right: "auto",
	alignSelf: "flex-start",

	transform: "none",
};

const Notification = () => {
	const { findAllNotifications, updateNotificationAsRead } = useNotification();

	const { notifications } = useContext(NotificationContext);

	const theme = useTheme();
	const navigate = useNavigate();
	const matchesXs = useMediaQuery(theme.breakpoints.down("md"));

	const anchorRef = useRef(null);
	const [open, setOpen] = useState(false);
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const handleMarkAllAsRead = async (data) => {
		await updateNotificationAsRead(data, "R");
		await findAllNotifications(1, "T", true);
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 0.75 }}>
			<IconButton
				color="secondary"
				sx={{ color: "text.primary", height: "44px" }}
				aria-label="open profile"
				ref={anchorRef}
				aria-controls={open ? "profile-grow" : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
			>
				<Badge badgeContent={notifications.some((e) => e.is_read === 0) ? "" : null} color="primary">
					<BellOutlined />
				</Badge>
			</IconButton>
			<Popper
				placement={matchesXs ? "bottom" : "bottom-end"}
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal
				popperOptions={{
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [matchesXs ? -5 : 0, 9],
							},
						},
					],
				}}
			>
				{({ TransitionProps }) => (
					<Transitions type="grow" position={matchesXs ? "top" : "top-right"} sx={{ overflow: "hidden" }} in={open} {...TransitionProps}>
						<Paper
							sx={{
								boxShadow: theme.customShadows.z1,
								width: "100%",
								minWidth: 285,
								maxWidth: 420,
								[theme.breakpoints.down("md")]: {
									maxWidth: 285,
								},
							}}
						>
							<ClickAwayListener onClickAway={handleClose}>
								<MainCard
									title="Notificações"
									elevation={0}
									border={false}
									content={false}
									secondary={
										<>
											{notifications.some((e) => e.is_read === 0) && (
												<Tooltip title="Marcar todas como lidas">
													<IconButton color="success" size="small" onClick={() => handleMarkAllAsRead(notifications.filter((e) => e.is_read === 0).map((e) => e.id_notification))}>
														<CheckCircleOutlined style={{ fontSize: "1.15rem" }} />
													</IconButton>
												</Tooltip>
											)}
										</>
									}
								>
									<List
										component="nav"
										sx={{
											p: 0,
											"& .MuiListItemButton-root": {
												py: 0.5,
												"& .MuiAvatar-root": avatarSX,
												"& .MuiListItemSecondaryAction-root": { ...actionSX, position: "relative" },
											},
										}}
									>
										{notifications.slice(0, 5).map((notification) => (
											<ListItemButton
												key={notification.id_notification}
												sx={{
													...(notification.is_read === 0 && {
														bgcolor: theme.palette.warning.lighter,
													}),
												}}
											>
												<ListItemText primary={<Typography variant="h6">{notification.message}</Typography>} secondary={dayjs(notification.created_at).fromNow()} />
											</ListItemButton>
										))}
									</List>
									<Divider />
									<ListItemButton sx={{ textAlign: "center", py: `${12}px !important` }}>
										<ListItemText
											primary={
												<Typography variant="h6" color="primary">
													Ver todas
												</Typography>
											}
											onClick={(event) => {
												navigate("/notifications/me");
												handleClose(event.target);
											}}
										/>
									</ListItemButton>
								</MainCard>
							</ClickAwayListener>
						</Paper>
					</Transitions>
				)}
			</Popper>
		</Box>
	);
};

export default Notification;
