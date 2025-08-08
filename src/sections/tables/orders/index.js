// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, useTheme, Box, OutlinedInput, Grid } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import OrderContext from "contexts/OrdersContext";
import dayjs from "dayjs";
import useOrder from "hooks/useOrder";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { EditOutlined, SaveOutlined, FileSearchOutlined } from "@ant-design/icons";
import useRequest from "hooks/useRequest";
import AlertChecklist from "sections/apps/orders/AlertChecklist";
import InspectionContext from "contexts/InspectionsContext";

export default function OrdersTable({ reload, setReload, search, tab }) {
	const { updateOrderStatus } = useOrder();
	const { updateRequest } = useRequest();

	const { orders, loadingOrders } = useContext(OrderContext);
	const { loadingInspection } = useContext(InspectionContext);

	const [editFuel, setEditFuel] = useState(false);
	const [editFuelValue, setEditFuelValue] = useState("");
	const [open, setOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState();

	const handleStatus = async (orderId, status) => {
		const data = { status: status };

		const response = await updateOrderStatus(orderId, data);
		setReload(!reload);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
	};

	const handleChange = async (requestId, itemOrder) => {
		const response = await updateRequest(requestId, { services: [{ id_service: itemOrder.item_id, name: itemOrder.name, amount: editFuelValue }], products: [] });
		setReload(!reload);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		setEditFuel(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<TableContainer>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Matrícula</TableCell>
							<TableCell align="center">Hora</TableCell>
							<TableCell align="center">Item</TableCell>
							<TableCell align="center">Quantidade </TableCell>
							<TableCell align="center">Atribuído a</TableCell>
							<TableCell align="center">Realizado por</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingOrders || loadingInspection ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : orders.length > 0 ? (
							orders.map((item, indexItem) =>
								item.itemOrders.map((itemOrder, indexOrder) => (
									<TableRow hover key={`${itemOrder.id_order}-${itemOrder.id_item}`}>
										<TableCell align="center">
											<Button
												disabled={loadingOrder}
												variant="contained"
												color={itemOrder.order_status === "P" ? "primary" : itemOrder.order_status === "E" ? "warning" : itemOrder.order_status === "C" ? "error" : "success"}
												sx={{ px: 1, py: 0.25, color: itemOrder.order_status === "E" ? "#252525" : "white" }}
												onClick={async () => {
													if (itemOrder.order_status === "F") return;
													if (itemOrder.order_status === "C") return;
													if (itemOrder.order_status === "P") {
														await handleStatus(itemOrder.id_order, "E");
													} else if (itemOrder.order_status === "E") {
														await handleStatus(itemOrder.id_order, "F");
													}
												}}
											>
												{itemOrder.order_status === "P" ? "Iniciar" : itemOrder.order_status === "E" ? "Concluir" : itemOrder.order_status === "C" ? "Cancelada" : "Finalizada"}
											</Button>
										</TableCell>
										<TableCell align="center">{item.registration}</TableCell>
										<TableCell align="center">
											{itemOrder.available_at === "P"
												? dayjs(item.landing_date).format("DD/MM/YYYY HH:mm")
												: itemOrder.available_at === "D"
													? dayjs(item.takeoff_date).format("DD/MM/YYYY HH:mm")
													: itemOrder.available_at === "A"
														? (() => {
																const now = dayjs();
																const landingDiff = Math.abs(now.diff(dayjs(item.landing_date)));
																const takeoffDiff = Math.abs(now.diff(dayjs(item.takeoff_date)));
																const closestDate = !takeoffDiff ? item.landing_date : landingDiff < takeoffDiff ? item.landing_date : item.takeoff_date;
																return dayjs(closestDate).format("DD/MM/YYYY HH:mm");
															})()
														: "Não agendado"}
										</TableCell>
										<TableCell align="center">
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
												<Typography>{itemOrder.name}</Typography>
												{itemOrder.checklist === "S" && itemOrder.order_status === "E" && (
													<FileSearchOutlined
														onClick={() => {
															setOpen(true);
															setSelectedOrder(itemOrder.id_order);
														}}
													/>
												)}
											</Grid>
										</TableCell>
										<TableCell align="center">
											{!editFuel ? (
												<Box display="inline-flex" alignItems="center" gap={1}>
													{itemOrder.unit === "un" ? "-" : itemOrder.amount === "full" ? "Full" : `${itemOrder.amount} ${itemOrder.unit}`}
													{itemOrder.unit === "L" && (itemOrder.order_status === "E" || itemOrder.order_status === "P") && (
														<EditOutlined
															style={{ cursor: "pointer" }}
															onClick={() => {
																setEditFuel(true);
															}}
														/>
													)}
												</Box>
											) : (
												<Box display="inline-flex" alignItems="center" gap={1}>
													<OutlinedInput
														id="fuel"
														type={"number"}
														value={editFuelValue}
														name="fuel"
														sx={{ height: "30px" }}
														inputProps={{
															style: { padding: 5, width: "50px" },
														}}
														onChange={(e) => {
															setEditFuelValue(e.target.value);
														}}
													/>
													<SaveOutlined
														style={{ cursor: "pointer" }}
														onClick={async () => {
															handleChange(item.id_request, itemOrder);
														}}
													/>
												</Box>
											)}
										</TableCell>
										<TableCell align="center">{itemOrder.attributed_to}</TableCell>
										<TableCell align="center">{itemOrder.finalized_by}</TableCell>
									</TableRow>
								))
							)
						) : search ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma ordem de serviço encontrada</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									{tab === 0 ? (
										<Typography variant="h5">Nenhuma ordem de serviço encontrada</Typography>
									) : tab === 1 ? (
										<Typography variant="h5">Nenhuma ordem de serviço aberta</Typography>
									) : tab === 2 ? (
										<Typography variant="h5">Nenhuma ordem de serviço em execução</Typography>
									) : tab === 3 ? (
										<Typography variant="h5">Nenhuma ordem de serviço finalizada</Typography>
									) : (
										<Typography variant="h5">Nenhuma ordem de serviço cancelada</Typography>
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<AlertChecklist open={open} handleClose={handleClose} selectedOrder={selectedOrder} />
			</TableContainer>
		</>
	);
}
