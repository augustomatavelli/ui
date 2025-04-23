// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, useTheme } from "@mui/material";

// project imports
import { useContext, useEffect } from "react";
import Loader from "components/Loader";
import OrderContext from "contexts/OrdersContext";
import dayjs from "dayjs";
import useOrder from "hooks/useOrder";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";

export default function OrdersTable({ reload, setReload, search, tab }) {
	const { updateOrderStatus } = useOrder();

	const { orders, loadingOrders } = useContext(OrderContext);

	const theme = useTheme();

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

	useEffect(() => {}, [orders]);

	return (
		<>
			<TableContainer>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Matrícula</TableCell>
							<TableCell align="center">Horário previsto</TableCell>
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
										<TableCell align="center">{`${itemOrder.amount} ${itemOrder.unit}`}</TableCell>
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
