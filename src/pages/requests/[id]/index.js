// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Chip, Collapse, CircularProgress, Skeleton } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect, useState, useCallback } from "react";
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
import OperationsContext from "contexts/OperationContext";
import { OperationsList } from "sections/apps/requests/OperationsList";

const RequestDetails = () => {
	const { findOneRequestById, updateRequest } = useRequest();
	const { searchAllProducts } = useProduct();
	const { searchAllOperations } = useOperation();

	const { requestDetails, setRequestDetails, loadingRequest } = useContext(RequestContext);
	const { searchProducts, loadingProduct } = useContext(ProductsContext);
	const { searchOperations, loadingService } = useContext(OperationsContext);

	const [openOperations, setOpenOperations] = useState(false);
	const [openProducts, setOpenProducts] = useState(false);
	const [editRequest, setEditRequest] = useState({});
	const [openEditInput, setOpenEditInput] = useState({});
	const [openAddProducts, setOpenAddProducts] = useState(false);
	const [openAddServices, setOpenAddServices] = useState(false);
	const [checked, setChecked] = useState({});

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
		setChecked({});
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
		setOpenAddServices(false);
		await findOneRequestById(id);
		handleLoadPage();
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
		setEditRequest((prev) => ({
			...prev,
			products: prev.products.map((p) => (p.id_product === id ? { ...p, amount: 0 } : p)),
		}));
	};

	const handleDeleteService = (id) => {
		setEditRequest((prev) => ({
			...prev,
			services: prev.services.map((p) => (p.id_service === id ? { ...p, amount: 0 } : p)),
		}));
	};

	const handleCheckboxChange = (e) => {
		const { name, amount, unit } = e;
		setChecked((prev) => {
			const newChecked = { ...prev, [name]: !prev[name] };
			handleChange(e.id_service, e.name, unit === "un" ? 1 : amount, e.unit);
			return newChecked;
		});
	};

	const handleChange = useCallback(
		(id, name, newAmount, unit) => {
			setEditRequest((prev) => {
				const services = prev.services || [];
				if (newAmount === 0) {
					return {
						...prev,
						services: services.map((p) => (p.id_service === id ? { ...p, amount: newAmount } : p)),
					};
				}
				const existingService = services.find((p) => p.id_service === id);
				if (!existingService) {
					return {
						...prev,
						services: [...services, { id_service: id, name: name, amount: newAmount, unit: unit }],
					};
				}

				return {
					...prev,
					services: services.map((p) => (p.id_service === id ? { ...p, amount: newAmount, unit: unit } : p)),
				};
			});
		},
		[setEditRequest]
	);

	const handleLoadPage = async () => {
		Object.keys(requestDetails).length && setEditRequest((prev) => ({ ...prev, products: [...requestDetails.products], services: [...requestDetails.services] }));
		requestDetails.services &&
			requestDetails.services.length > 0 &&
			requestDetails.services.forEach((e) =>
				setChecked((prev) => {
					const newChecked = { ...prev, [e.name]: !prev[e.name] };
					return newChecked;
				})
			);
	};

	useEffect(() => {
		handleLoadPage();
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
															{status === "A" && (
																<EditOutlined
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		handleOpenEditInput("landingDateField");
																	}}
																/>
															)}
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
															{status === "A" && (
																<EditOutlined
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		handleOpenEditInput("takeoffDateField");
																	}}
																/>
															)}
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
										<ListItem onClick={() => setOpenOperations(!openOperations)} sx={{ cursor: "pointer" }}>
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
																	<List sx={{ padding: 0, display: "flex", gap: 1, width: "fit-content" }}>
																		{editRequest.services &&
																			editRequest.services.length > 0 &&
																			editRequest.services.map(
																				(e) =>
																					e.amount > 0 && (
																						<Chip
																							label={e.unit === "un" ? `${e.name}` : `${e.name} ${e.amount}${e.unit}`}
																							onDelete={() => {
																								handleOpenEditInput("services");
																								handleDeleteService(e.id_service);
																							}}
																							key={e.id_service}
																							sx={{ alignSelf: "start", borderRadius: "16px" }}
																							disabled={status === "F" || status === "R"}
																						/>
																					)
																			)}
																	</List>
																	{status === "A" && (
																		<Grid sx={{ mt: 2 }}>
																			<Button
																				variant="contained"
																				size="small"
																				startIcon={<PlusOutlined />}
																				onClick={async (event) => {
																					event.stopPropagation();
																					await searchAllOperations();
																					handleOpenEditInput("services");
																					setOpenAddServices(true);
																				}}
																			>
																				Adicionar
																			</Button>
																		</Grid>
																	)}
																</>
															) : loadingService ? (
																<CircularProgress size={20} />
															) : (
																<OperationsList
																	checked={checked}
																	setChecked={setChecked}
																	searchOperations={searchOperations}
																	requestObject={editRequest}
																	handleChange={handleChange}
																	handleCheckboxChange={handleCheckboxChange}
																/>
															)}
														</Box>
													</Collapse>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem onClick={() => setOpenProducts(!openProducts)} sx={{ cursor: "pointer" }}>
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
																	<List sx={{ padding: 0, display: "flex", gap: 1, width: "fit-content" }}>
																		{editRequest.products &&
																			editRequest.products.length > 0 &&
																			editRequest.products.map(
																				(e) =>
																					e.amount > 0 && (
																						<Chip
																							label={`${e.amount}x ${e.name}`}
																							onDelete={() => {
																								handleOpenEditInput("products");
																								handleDeleteProduct(e.id_product);
																							}}
																							key={e.id_product}
																							sx={{ alignSelf: "start", borderRadius: "16px" }}
																							disabled={status === "F" || status === "R"}
																						/>
																					)
																			)}
																	</List>
																	{status === "A" && (
																		<Grid sx={{ mt: 2 }}>
																			<Button
																				variant="contained"
																				size="small"
																				startIcon={<PlusOutlined />}
																				onClick={async (event) => {
																					event.stopPropagation();
																					handleOpenEditInput("products");
																					await searchAllProducts();
																					setOpenAddProducts(true);
																				}}
																				disabled={status === "F" || status === "R"}
																			>
																				Adicionar
																			</Button>
																		</Grid>
																	)}
																</>
															) : (
																<Grid>
																	<Box
																		sx={{
																			display: "flex",
																			overflowX: "auto",
																			padding: "1rem",
																			whiteSpace: "nowrap",
																			"&::-webkit-scrollbar": {
																				height: "8px",
																			},
																			"&::-webkit-scrollbar-thumb": {
																				backgroundColor: "#888",
																			},
																			"&::-webkit-scrollbar-thumb:hover": {
																				backgroundColor: "#555",
																			},
																		}}
																	>
																		{loadingProduct ? (
																			Array.from({ length: 5 }).map((_, index) => (
																				<Grid key={index} sx={{ display: "flex" }}>
																					<Skeleton variant="rectangular" width={200} height={50} />
																				</Grid>
																			))
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
																</Grid>
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
