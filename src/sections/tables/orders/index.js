import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box, OutlinedInput, Grid, IconButton, Tooltip } from "@mui/material";
import { useContext, useMemo, useState, useRef } from "react";
import OrderContext from "contexts/OrdersContext";
import useOrder from "hooks/useOrder";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { EditOutlined, SaveOutlined, FileSearchOutlined, PaperClipOutlined, EyeOutlined } from "@ant-design/icons";
import useRequest from "hooks/useRequest";
import AlertChecklist from "sections/apps/orders/AlertChecklist";
import InspectionContext from "contexts/InspectionsContext";
import { fromDisplay } from "utils/date";
import AlertComissary from "sections/apps/orders/AlertComissary";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

export default function OrdersTable({ reload, setReload, search, tab }) {
	const { updateOrderStatus } = useOrder();
	const { updateRequest } = useRequest();

	const { orders, loadingOrder } = useContext(OrderContext);
	const { loadingInspection, setInspections } = useContext(InspectionContext);

	const [editFuel, setEditFuel] = useState({});
	const [editFuelValue, setEditFuelValue] = useState({});
	const [open, setOpen] = useState(false);
	const [openComissary, setOpenComissary] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState();
	const [selectedProducts, setSelectedProducts] = useState(null);
	const [photoOrderId, setPhotoOrderId] = useState(null);
	const [orderPhotos, setOrderPhotos] = useState({});
	const fileInputRef = useRef(null);

	const loading = loadingOrder || loadingInspection;
	const isEmpty = useMemo(() => !loading && orders.length === 0, [loading, orders.length]);

	const handleStatus = async (orderId, status) => {
		const data = { status: status };

		if (orderPhotos[orderId]) {
			data.ce = orderPhotos[orderId];
		}

		return await updateOrderStatus(orderId, data);
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
			}),
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
				}),
			);
			setPhotoOrderId(null);
		};
		reader.readAsDataURL(file);
	};

	const handleClose = () => {
		setInspections([]);
		setOpen(false);
		setOpenComissary(false);
		setSelectedProducts(null);
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
							<TableCell align="center">Quantidade</TableCell>
							<TableCell align="center">Atribuído a</TableCell>
							<TableCell align="center">Realizado por</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableSkeleton rows={5} columns={7} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={7}>
									<EmptyState
										title="Nenhum resultado encontrado"
										description={
											search
												? "Nenhuma ordem de serviço encontrada."
												: tab === 0
													? "Nenhuma ordem de serviço encontrada."
													: tab === 1
														? "Nenhuma ordem de serviço aberta."
														: tab === 2
															? "Nenhuma ordem de serviço em execução."
															: tab === 3
																? "Nenhuma ordem de serviço finalizada."
																: "Nenhuma ordem de serviço cancelada."
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							orders.map((item, index) => (
								<TableRow hover key={`${item.id_order}-${item.id_item}-${index}`}>
									<TableCell align="center">
										<Button
											disabled={loadingOrder || item.order_status === "F" || item.order_status === "C"}
											variant="contained"
											color={item.order_status === "P" ? "primary" : item.order_status === "E" ? "warning" : item.order_status === "C" ? "error" : "success"}
											sx={{ px: 1, py: 0.25, color: item.order_status === "E" ? "#252525" : "white" }}
											onClick={async () => {
												const newStatus = item.order_status === "P" ? "E" : "F";
												const orderIds = item.id_orders && item.id_orders.length > 0 ? item.id_orders : [item.id_order];
												const results = await Promise.all(orderIds.map((orderId) => handleStatus(orderId, newStatus)));
												setReload(!reload);

												const allSucceeded = results.every((result) => result);
												if (!allSucceeded) {
													return;
												}

												const successMessage = "Ordem atualizada com sucesso";

												dispatch(
													openSnackbar({
														open: true,
														message: successMessage,
														variant: "alert",
														alert: {
															color: "success",
														},
														close: false,
													}),
												);
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
															const now = Date.now();
															const landing = item.landing_date ? fromDisplay(item.landing_date) : null;
															const takeoff = item.takeoff_date ? fromDisplay(item.takeoff_date) : null;
															// Sem uma das datas, mostra a que existir.
															if (!landing) return item.takeoff_date || "Não agendado";
															if (!takeoff) return item.landing_date || "Não agendado";
															// Mostra a hora mais próxima do momento atual.
															const landingDiff = Math.abs(now - landing.getTime());
															const takeoffDiff = Math.abs(now - takeoff.getTime());
															return landingDiff <= takeoffDiff ? item.landing_date : item.takeoff_date;
														})()
													: "Não agendado"}
									</TableCell>
									<TableCell align="center">
										{item.products ? (
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
												<Typography>Comissaria</Typography>
												<Tooltip title="Visualizar comissaria">
													<IconButton
														size="small"
														aria-label="Visualizar comissaria"
														onClick={() => {
															setSelectedProducts(item.products);
															setOpenComissary(true);
														}}
													>
														<EyeOutlined />
													</IconButton>
												</Tooltip>
											</Grid>
										) : (
											<Grid sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
												<Typography>{item.name}</Typography>
												{item.checklist === "S" && item.order_status === "E" ? (
													<FileSearchOutlined
														onClick={() => {
															setOpen(true);
															setSelectedOrder(item.id_order);
														}}
													/>
												) : item.is_fuel && item.order_status === "E" ? (
													<PaperClipOutlined onClick={() => handlePhotoClick(item.id_order)} style={{ cursor: "pointer", color: orderPhotos[item.id_order] ? "#52c41a" : "inherit" }} />
												) : null}
											</Grid>
										)}
									</TableCell>
									<TableCell align="center">
										{!editFuel[`${item.id_order}-${item.id_item}`] ? (
											<Box display="inline-flex" alignItems="center" gap={1}>
												{item.unit === "un" || item.unit === "pacote" ? "-" : item.amount === "full" ? "Full" : `${item.amount} ${item.unit}`}
												{item.unit === "L" && (item.order_status === "E" || item.order_status === "P") && (
													<Tooltip title="Editar quantidade">
														<IconButton
															size="small"
															aria-label="Editar quantidade"
															onClick={() => {
																const itemKey = `${item.id_order}-${item.id_item}`;
																setEditFuel((prev) => ({ ...prev, [itemKey]: true }));
																setEditFuelValue((prev) => ({ ...prev, [itemKey]: item.amount === "full" ? "" : item.amount }));
															}}
														>
															<EditOutlined />
														</IconButton>
													</Tooltip>
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
						)}
					</TableBody>
				</Table>
				<AlertChecklist open={open} handleClose={handleClose} selectedOrder={selectedOrder} />
				<AlertComissary open={openComissary} handleClose={handleClose} products={selectedProducts} />
			</TableContainer>

			<input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileSelect} />
		</>
	);
}

OrdersTable.propTypes = {
	reload: PropTypes.bool,
	setReload: PropTypes.func,
	search: PropTypes.string,
	tab: PropTypes.number,
};
