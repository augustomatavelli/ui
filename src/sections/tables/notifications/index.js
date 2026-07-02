import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Checkbox, useTheme, LinearProgress } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import NotificationContext from "contexts/NotificationContext";
import useNotification from "hooks/useNotification";
import { NotificationFilter } from "./NotificationFilter";
import { NotificationMarkAsRead } from "./NotificationMarkAsRead";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

const COLUMN_COUNT = 3;

export default function NotificationsTable({ openFilter, reload }) {
	const { findAllNotifications, updateNotificationAsRead } = useNotification();

	const { notifications, loadingNotification, totalNotification } = useContext(NotificationContext);

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
		setPage(1);
	}, [selectedStatus]);

	useEffect(() => {
		const controller = new AbortController();
		findAllNotifications(page, selectedStatus, undefined, controller.signal);

		return () => controller.abort();
	}, [reload, selectedStatus, page]);

	const isEmpty = useMemo(() => !loadingNotification && notifications.length === 0, [loadingNotification, notifications.length]);


	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					{/* <SearchLogByAdmin setSearch={setSearch} /> */}
					<NotificationMarkAsRead handleUpdate={handleUpdate} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalNotification} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
					</Stack>
				</Grid>
				{openFilter && <NotificationFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />}
				{loadingNotification && <LinearProgress />}
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
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhuma notificação foi encontrada com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							notifications.map((notification) => (
								<TableRow hover key={notification.id_notification} sx={{ bgcolor: notification.is_read === 0 ? theme.palette.warning.lighter : "inherit" }}>
									<TableCell align="center">
										<Checkbox checked={selectedNotifications.includes(notification.id_notification)} onChange={() => handleSelectNotification(notification.id_notification)} />
									</TableCell>
									<TableCell align="start">{notification.message}</TableCell>
									<TableCell align="center">{notification.created_at}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

NotificationsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
