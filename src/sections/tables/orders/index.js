// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, useTheme, Box, OutlinedInput } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import OrderContext from "contexts/OrdersContext";
import dayjs from "dayjs";
import useOrder from "hooks/useOrder";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import useRequest from "hooks/useRequest";

export default function OrdersTable({ reload, setReload, search, tab }) {
	const { updateOrderStatus } = useOrder();
	const { updateRequest } = useRequest();

	const { orders, loadingOrders } = useContext(OrderContext);

	const [editFuel, setEditFuel] = useState(false);
	const [editFuelValue, setEditFuelValue] = useState("");

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

	useEffect(() => {}, [orders]);

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
						{loadingOrders ? (
							<Loader />
						) : orders.length > 0 ? (
							orders.map((item, indexItem) =>
								item.itemOrders.map((itemOrder, indexOrder) => (
									<TableRow hover key={`${itemOrder.id_order}-${itemOrder.id_item}`}>
										<TableCell align="center">
											<Button
												variant="contained"
												color={itemOrder.order_status === "P" ? "error" : itemOrder.order_status === "E" ? "warning" : "success"}
												sx={{ px: 1, py: 0.25, color: itemOrder.order_status === "E" ? "black" : "white" }}
												onClick={async () => {
													if (itemOrder.order_status === "F") return;
													if (itemOrder.order_status === "P") {
														await handleStatus(itemOrder.id_order, "E");
													} else if (itemOrder.order_status === "E") {
														await handleStatus(itemOrder.id_order, "F");
													}
												}}
											>
												{itemOrder.order_status === "P" ? "Iniciar" : itemOrder.order_status === "E" ? "Concluir" : "Finalizada"}
											</Button>
										</TableCell>
										<TableCell align="center">{item.registration}</TableCell>
										<TableCell align="center">
											{itemOrder.type === "P" ? dayjs(item.landing_date).format("DD/MM/YYYY HH:mm") : item.takeoff_date ? dayjs(item.takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}
										</TableCell>
										<TableCell align="center">{itemOrder.name}</TableCell>
										<TableCell align="center">
											{!editFuel ? (
												<Box display="inline-flex" alignItems="center" gap={1}>
													{itemOrder.unit === "un" ? "-" : itemOrder.amount === "full" ? "Full" : `${itemOrder.amount}${itemOrder.unit}`}
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
									) : (
										<Typography variant="h5">Nenhuma ordem de serviço finalizada</Typography>
									)}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
