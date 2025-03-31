// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Chip, Collapse, Table } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import RequestContext from "contexts/RequestContext";
import useRequest from "hooks/useRequest";
import dayjs from "dayjs";
import { UpOutlined, DownOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Loader from "components/Loader";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import useOperation from "hooks/useOperation";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { ProductsList } from "sections/apps/requests/ProductsList";

const RequestDetails = () => {
	const { findOneRequestById, updateRequest } = useRequest();
	const { searchAllProducts } = useProduct();
	const { searchAllOperations } = useOperation();

	const { requestDetails, setRequestDetails, loadingRequest } = useContext(RequestContext);
	const { searchProducts, loadingProduct } = useContext(ProductsContext);

	const [openOperations, setOpenOperations] = useState(false);
	const [openProducts, setOpenProducts] = useState(false);
	const [editRequest, setEditRequest] = useState({});
	const [openEditInput, setOpenEditInput] = useState({});
	const [openAddProducts, setOpenAddProducts] = useState(false);
	const [openAddServices, setOpenAddServices] = useState(false);

	const { id } = useParams();

	const { id_request, landing_date, takeoff_date, status, created_at, user, type, rab, landing_site, products, services } = requestDetails;

	const resetStates = () => {
		setRequestDetails({});
		setOpenEditInput({});
		setOpenOperations(false);
		setOpenProducts(false);
		setEditRequest({});
		setOpenAddProducts(false);
		setOpenAddServices(false);
	};

	const handleOpenEditInput = (field) => {
		setOpenEditInput((prev) => {
			const newState = { ...prev };

			if (newState[field]) {
				delete newState[field];
			} else {
				newState[field] = 1;
			}

			return newState;
		});
	};

	const handleEditRequest = (e, field) => {
		setEditRequest((prev) => ({
			...prev,
			[field]: e ? dayjs(e).format("YYYY-MM-DD HH:mm") : null,
		}));
	};

	const handleEditSave = async () => {
		const response = await updateRequest(id, editRequest);
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
		setEditRequest({});
		setOpenEditInput({});
		setOpenAddProducts(false);
		await findOneRequestById(id);
	};

	const handleAddProduct = (newProduct, name) => {
		setEditRequest((prev) => {
			const products = prev.products || [];
			const existingProduct = products.find((p) => p.id_product === newProduct);
			if (!existingProduct) {
				return {
					...prev,
					products: [...products, { id_product: newProduct, name: name, amount: 1 }],
				};
			}
			return {
				...prev,
				products: products.map((p) => (p.id_product === newProduct ? { ...p, amount: p.amount + 1 } : p)),
			};
		});
	};

	const handleChangeProductAmount = (id, newAmount) => {
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: newAmount } : p)),
		}));
	};

	const handleRemoveProduct = (id) => {
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: Math.max(0, p.amount - 1) } : p)),
		}));
	};

	const handleDeleteProduct = (id) => {
		if (Object.keys(openEditInput).length === 0) {
			handleOpenEditInput("products");
		}
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: 0 } : p)),
		}));
	};

	const handleDeleteService = () => {};

	console.log(editRequest);
	useEffect(() => {
		Object.keys(requestDetails).length && setEditRequest((prev) => ({ ...prev, products: [...requestDetails.products] }));
	}, [requestDetails]);

	useEffect(() => {
		if (id) {
			findOneRequestById(id);
		}
	}, [id]);

	return (
		<>
			<Grid item xs={12}>
				<MainCard
					title="Detalhes da solicitação"
					secondary={
						!loadingRequest && (
							<Chip
								color={status === "A" ? "primary" : status === "F" ? "success" : status === "P" ? "warning" : "error"}
								variant="filled"
								size="medium"
								label={status === "A" ? "Em aberto" : status === "P" ? "Pendente" : status === "F" ? "Finalizado" : "Rejeitado"}
								sx={{ fontWeight: "bold" }}
							/>
						)
					}
				>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingRequest ? (
								<Loader />
							) : (
								<>
									<List sx={{ py: 0 }}>
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Número da solicitação</Typography>
														<Typography>{`# ${id_request}`}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Aeródromo</Typography>
														<Typography>{landing_site}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">RAB</Typography>
														<Typography>{rab}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={1}>
														<Stack direction="row" alignItems="center" spacing={1.5}>
															<Typography color="secondary">Data agendada para pouso</Typography>
															<EditOutlined
																style={{ cursor: "pointer" }}
																onClick={() => {
																	handleOpenEditInput("landingDateField");
																}}
															/>
														</Stack>
														{openEditInput["landingDateField"] ? (
															<LocalizationProvider dateAdapter={AdapterDateFns}>
																<DateTimePicker
																	value={landing_date ? dayjs(landing_date).toDate() : null}
																	disablePast
																	minDateTime={dayjs()}
																	onChange={(e) => {
																		handleEditRequest(e, "landing_date");
																	}}
																	slotProps={{
																		field: { format: "dd/MM/yyyy HH:mm" },
																		textField: { error: false },
																	}}
																/>
															</LocalizationProvider>
														) : (
															<Typography>{dayjs(landing_date).format("DD/MM/YYYY HH:mm")}</Typography>
														)}
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={1}>
														<Stack direction="row" alignItems="center" spacing={1.5}>
															<Typography color="secondary">Data agendada para decolagem</Typography>
															<EditOutlined
																style={{ cursor: "pointer" }}
																onClick={() => {
																	handleOpenEditInput("takeoffDateField");
																}}
															/>
														</Stack>
														{openEditInput["takeoffDateField"] ? (
															<LocalizationProvider dateAdapter={AdapterDateFns}>
																<DateTimePicker
																	value={takeoff_date ? dayjs(takeoff_date).toDate() : null}
																	disablePast
																	minDateTime={dayjs()}
																	onChange={(e) => {
																		handleEditRequest(e, "takeoff_date");
																	}}
																	slotProps={{
																		field: { format: "dd/MM/yyyy HH:mm" },
																	}}
																/>
															</LocalizationProvider>
														) : (
															<Typography>{takeoff_date ? dayjs(takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}</Typography>
														)}
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Solicitado por</Typography>
														<Typography>{user}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Aberta em</Typography>
														<Typography>{dayjs(created_at).format("DD/MM/YYYY HH:mm")}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3} alignItems="center">
												<Grid item xs={6}>
													<Typography color="secondary">Serviços</Typography>
												</Grid>
												<Grid item xs={6} display="flex" justifyContent="flex-end">
													<Button type="secondary" onClick={() => setOpenOperations(!openOperations)} color="secondary">
														{openOperations ? <UpOutlined /> : <DownOutlined />}
													</Button>
												</Grid>
												<Grid item xs={12}>
													<Collapse in={openOperations}>
														<Box sx={{ padding: 0 }}>
															{!openAddServices ? (
																<>
																	<Table>
																		<List sx={{ padding: 0, display: "flex", flexDirection: "column", gap: 1, width: "fit-content" }}>
																			{editRequest.services.length > 0 &&
																				services.map((e) => (
																					<Chip
																						label={`${e.name} ${e.amount}L`}
																						onDelete={() => {
																							handleDeleteService();
																						}}
																						key={e.id_service}
																						sx={{ alignSelf: "start" }}
																					/>
																				))}
																		</List>
																	</Table>
																	<Grid sx={{ mt: 2 }}>
																		<Button
																			variant="contained"
																			size="small"
																			startIcon={<PlusOutlined />}
																			onClick={async () => {
																				await searchAllOperations();
																				setOpenAddServices(true);
																			}}
																		>
																			Adicionar
																		</Button>
																	</Grid>
																</>
															) : (
																<></>
															)}
														</Box>
													</Collapse>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3} alignItems="center">
												<Grid item xs={6}>
													<Typography color="secondary">Produtos</Typography>
												</Grid>
												<Grid item xs={6} display="flex" justifyContent="flex-end">
													<Button type="secondary" onClick={() => setOpenProducts(!openProducts)} color="secondary">
														{openProducts ? <UpOutlined /> : <DownOutlined />}
													</Button>
												</Grid>
												<Grid item xs={12}>
													<Collapse in={openProducts}>
														<Box sx={{ padding: 0 }}>
															{!openAddProducts ? (
																<>
																	<Table>
																		<List sx={{ padding: 0, display: "flex", flexDirection: "column", gap: 1, width: "fit-content" }}>
																			{editRequest.products.length > 0 &&
																				editRequest.products.map((e) => (
																					<Chip label={`${e.amount}x ${e.name}`} onDelete={() => handleDeleteProduct(e.id_product)} key={e.id_product} sx={{ alignSelf: "start" }} />
																				))}
																		</List>
																	</Table>
																	<Grid sx={{ mt: 2 }}>
																		<Button
																			variant="contained"
																			size="small"
																			startIcon={<PlusOutlined />}
																			onClick={async () => {
																				await searchAllProducts();
																				handleOpenEditInput("products");
																				setOpenAddProducts(true);
																			}}
																		>
																			Adicionar
																		</Button>
																	</Grid>
																</>
															) : loadingProduct ? (
																<Loader />
															) : (
																<ProductsList
																	searchProducts={searchProducts}
																	requestObject={editRequest}
																	handleAddProduct={handleAddProduct}
																	handleChangeProductAmount={handleChangeProductAmount}
																	handleRemoveProduct={handleRemoveProduct}
																/>
															)}
														</Box>
													</Collapse>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
									</List>
									<Box sx={{ p: 2.5 }}>
										<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
											<Button
												variant="outlined"
												color="error"
												onClick={() => {
													resetStates();
													window.history.back();
												}}
											>
												Voltar
											</Button>
											{Object.keys(editRequest).length > 0 && Object.keys(openEditInput).length > 0 && (
												<Button variant="contained" onClick={handleEditSave}>
													Salvar
												</Button>
											)}
										</Stack>
									</Box>
								</>
							)}
						</Grid>
					</Grid>
				</MainCard>
			</Grid>
		</>
	);
};

export default RequestDetails;
