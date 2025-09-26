import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Checkbox, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import NotificationContext from "contexts/NotificationContext";
import useNotification from "hooks/useNotification";
import { NotificationFilter } from "./NotificationFilter";
import { NotificationMarkAsRead } from "./NotificationMarkAsRead";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

export default function NotificationsTable({ openFilter, reload }) {
	const { findAllNotifications, updateNotificationAsRead } = useNotification();

	const { notifications, loadingNotification } = useContext(NotificationContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState("T");
	const [selectedNotifications, setSelectedNotifications] = useState([]);

	const theme = useTheme();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleSelectNotification = (notificationId) => {
		if (selectedNotifications.includes(notificationId)) {
			setSelectedNotifications(selectedNotifications.filter((id) => id !== notificationId));
		} else {
			setSelectedNotifications([...selectedNotifications, notificationId]);
		}
	};

	const handleSelectAll = () => {
		if (selectedNotifications.length === notifications.length) {
			setSelectedNotifications([]);
		} else {
			setSelectedNotifications(notifications.map((n) => n.id_notification));
		}
	};

	const isAllSelected = notifications.length > 0 && selectedNotifications.length === notifications.length;
	const isIndeterminate = selectedNotifications.length > 0 && selectedNotifications.length < notifications.length;

	const handleUpdate = async (action) => {
		if (selectedNotifications.length > 0) {
			await updateNotificationAsRead(selectedNotifications, action);
			setSelectedNotifications([]);
			findAllNotifications(page, selectedStatus);
		}
	};

	useEffect(() => {
		findAllNotifications(page, selectedStatus);
	}, [reload, selectedStatus]);

	useEffect(() => {}, [notifications]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					{/* <SearchLogByAdmin setSearch={setSearch} /> */}
					<NotificationMarkAsRead handleUpdate={handleUpdate} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={1} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{openFilter && <NotificationFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">
								<Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={handleSelectAll} disabled={notifications.length === 0} />
							</TableCell>
							<TableCell align="center">Mensagem</TableCell>
							<TableCell align="center">Data</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingNotification ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : notifications.length > 0 ? (
							notifications.map((notification) => (
								<TableRow hover key={notification.id_notification} sx={{ bgcolor: notification.is_read === 0 ? theme.palette.warning.lighter : "inherit" }}>
									<TableCell align="center">
										<Checkbox checked={selectedNotifications.includes(notification.id_notification)} onChange={() => handleSelectNotification(notification.id_notification)} />
									</TableCell>
									<TableCell align="start">{notification.message}</TableCell>
									<TableCell align="center">{dayjs(notification.created_at).format("DD/MM/YYYY HH:mm")}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={10} align="center">
									<Typography variant="h5">Nenhuma notificação encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={10} align="center">
									<Typography variant="h5">Nenhuma notificação registrada</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
