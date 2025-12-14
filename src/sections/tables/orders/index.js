import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, useTheme, Box, OutlinedInput, Grid, IconButton, TextField } from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import Loader from "components/Loader";
import OrderContext from "contexts/OrdersContext";
import useOrder from "hooks/useOrder";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { EditOutlined, SaveOutlined, FileSearchOutlined, PaperClipOutlined } from "@ant-design/icons";
import useRequest from "hooks/useRequest";
import AlertChecklist from "sections/apps/orders/AlertChecklist";
import InspectionContext from "contexts/InspectionsContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function OrdersTable({ reload, setReload, search, tab }) {
	const { updateOrderStatus } = useOrder();
	const { updateRequest } = useRequest();

	const { orders, loadingOrder } = useContext(OrderContext);
	const { loadingInspection, setInspections } = useContext(InspectionContext);

	const [editFuel, setEditFuel] = useState({});
	const [editFuelValue, setEditFuelValue] = useState({});
	const [open, setOpen] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState();
	const [photoOrderId, setPhotoOrderId] = useState(null);
	const [orderPhotos, setOrderPhotos] = useState({});
	const fileInputRef = useRef(null);

	const handleStatus = async (orderId, status) => {
		const data = { status: status };

		if (orderPhotos[orderId]) {
			data.ce = orderPhotos[orderId];
		}

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
		const itemKey = `${itemOrder.id_order}-${itemOrder.id_item}`;
		const response = await updateRequest(requestId, { services: [{ id_service: itemOrder.item_id, name: itemOrder.name, amount: editFuelValue[itemKey] }], products: [] });
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
		setEditFuel((prev) => ({ ...prev, [itemKey]: false }));
		setEditFuelValue((prev) => ({ ...prev, [itemKey]: "" }));
	};

	const handlePhotoClick = (orderId) => {
		setPhotoOrderId(orderId);
		fileInputRef.current.click();
	};

	const handleFileSelect = (event) => {
		const file = event.target.files[0];
		if (file) {
			convertToBase64(file);
		}
		event.target.value = "";
	};

	const convertToBase64 = (file) => {
		const reader = new FileReader();
		reader.onloadend = async () => {
			const base64String = reader.result;
			const base64Only = base64String.split(",")[1];
			setOrderPhotos((prev) => ({ ...prev, [photoOrderId]: base64Only }));
			dispatch(
				openSnackbar({
					open: true,
					message: "Foto adicionada com sucesso!",
					variant: "alert",
					alert: {
						color: "success",
					},
					close: false,
				})
			);
			setPhotoOrderId(null);
		};
		reader.readAsDataURL(file);
	};

	const handleClose = () => {
		setInspections([]);
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
						{loadingOrder || loadingInspection ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : orders.length > 0 ? (
							orders.map((item, indexItem) => (
								<TableRow hover key={`${item.id_order}-${item.id_item}`}>
									<TableCell align="center">
										<Button
											disabled={loadingOrder}
											variant="contained"
											color={item.order_status === "P" ? "primary" : item.order_status === "E" ? "warning" : item.order_status === "C" ? "error" : "success"}
											sx={{ px: 1, py: 0.25, color: item.order_status === "E" ? "#252525" : "white" }}
											onClick={async () => {
												if (item.order_status === "F") return;
												if (item.order_status === "C") return;
												if (item.order_status === "P") {
													await handleStatus(item.id_order, "E");
												} else if (item.order_status === "E") {
													await handleStatus(item.id_order, "F");
												}
											}}
										>
											{item.order_status === "P" ? "Iniciar" : item.order_status === "E" ? "Concluir" : item.order_status === "C" ? "Cancelada" : "Finalizada"}
										</Button>
									</TableCell>
									<TableCell align="center">{item.registration}</TableCell>
									<TableCell align="center">
										{item.available_at === "P"
											? item.landing_date
											: item.available_at === "D"
												? item.takeoff_date
												: item.available_at === "A"
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
											<Typography>{item.name}</Typography>
											{item.checklist === "S" && item.order_status === "E" ? (
												<FileSearchOutlined
													onClick={() => {
														setOpen(true);
														setSelectedOrder(item.id_order);
													}}
												/>
											) : item.item_id === 1 && item.order_status === "E" ? (
												<PaperClipOutlined onClick={() => handlePhotoClick(item.id_order)} style={{ cursor: "pointer", color: orderPhotos[item.id_order] ? "#52c41a" : "inherit" }} />
											) : null}
										</Grid>
									</TableCell>
									<TableCell align="center">
										{!editFuel[`${item.id_order}-${item.id_item}`] ? (
											<Box display="inline-flex" alignItems="center" gap={1}>
												{item.unit === "un" ? "-" : item.amount === "full" ? "Full" : `${item.amount} ${item.unit}`}
												{item.unit === "L" && (item.order_status === "E" || item.order_status === "P") && (
													<IconButton
														size="small"
														onClick={() => {
															const itemKey = `${item.id_order}-${item.id_item}`;
															setEditFuel((prev) => ({ ...prev, [itemKey]: true }));
															setEditFuelValue((prev) => ({ ...prev, [itemKey]: item.amount === "full" ? "" : item.amount }));
														}}
													>
														<EditOutlined />
													</IconButton>
												)}
											</Box>
										) : (
											<Box display="inline-flex" alignItems="center" gap={1}>
												<OutlinedInput
													id="fuel"
													type={"number"}
													value={editFuelValue[`${item.id_order}-${item.id_item}`] || ""}
													name="fuel"
													sx={{ height: "30px" }}
													inputProps={{
														style: { padding: 5, width: "50px" },
													}}
													onChange={(e) => {
														const itemKey = `${item.id_order}-${item.id_item}`;
														setEditFuelValue((prev) => ({ ...prev, [itemKey]: e.target.value }));
													}}
												/>
												<SaveOutlined
													style={{ cursor: "pointer" }}
													onClick={async () => {
														handleChange(item.id_request, item);
													}}
												/>
											</Box>
										)}
									</TableCell>
									<TableCell align="center">{item.attributed_to}</TableCell>
									<TableCell align="center">{item.finalized_by}</TableCell>
								</TableRow>
							))
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

			<input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileSelect} />
		</>
	);
}
