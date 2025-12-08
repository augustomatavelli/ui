// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Chip, OutlinedInput, InputLabel, RadioGroup, Radio, FormControlLabel, IconButton } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import Loader from "components/Loader";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import UserContext from "contexts/UserContext";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

const ProductDetails = () => {
	const { findOneProductById, updateProduct } = useProduct();

	const { loadingProduct, productDetails } = useContext(ProductsContext);
	const { user } = useContext(UserContext);

	/* const [openAlert, setOpenAlert] = useState(false); */
	const [editPrice, setEditPrice] = useState(false);
	const [editPriceValue, setEditPriceValue] = useState("");
	const [available, setAvailable] = useState("");
	const [stock, setStock] = useState("");

	const { id } = useParams();

	const { id_product, image, name, category_name, available_at, price, status, inventory } = productDetails;

	const handleChangeAvailable = (event) => {
		setAvailable(event.target.value);
	};

	const handleChangeStock = (event) => {
		setStock(event.target.value);
	};

	const handleSave = async () => {
		try {
			const response = await updateProduct(id_product, {
				price: editPriceValue ? editPriceValue : price,
				available_at: available,
				inventory: stock,
			});
			dispatch(
				openSnackbar({
					open: true,
					message: response.message,
					variant: "alert",
					alert: { color: "success" },
					close: false,
				})
			);
			setEditPrice(false);
			await findOneProductById(id);
		} catch (error) {
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;
			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err] ?? "Erro ao salvar alterações",
					variant: "alert",
					alert: { color: "error" },
					close: false,
				})
			);
		}
	};

	useEffect(() => {
		setAvailable(productDetails.available_at);
	}, [productDetails]);
	/* const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	}; */

	useEffect(() => {
		if (id) {
			findOneProductById(id);
		}
	}, [id]);

	return (
		<>
			<Grid item xs={12}>
				<MainCard
					title="Detalhes do produto"
					secondary={
						!loadingProduct && (
							<Chip
								color={status === "D" ? "success" : "error"}
								variant="filled"
								size="medium"
								label={status === "D" ? "Disponível" : "Indisponível"}
								sx={{ fontWeight: "bold", color: status === "P" ? "#252525" : "white" }}
							/>
						)
					}
				>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingProduct ? (
								<Loader />
							) : (
								<>
									<List sx={{ py: 0 }}>
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Box
															sx={{
																width: "fit-content",
																height: "100px",
																overflow: "hidden",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																backgroundColor: "#f0f0f0",
															}}
														>
															<img
																src={image}
																alt="Product"
																style={{
																	height: "100%",
																	objectFit: "fill",
																}}
															/>
														</Box>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Nome</Typography>
														<Typography>{name}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Categoria</Typography>
														<Typography>{category_name}</Typography>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Typography color="secondary">Preço</Typography>
														{!editPrice ? (
															<Box display="inline-flex" alignItems="center" gap={1}>
																<Typography>
																	{new Intl.NumberFormat("pt-BR", {
																		style: "currency",
																		currency: "BRL",
																	}).format(Number(price))}
																</Typography>
																<IconButton
																	size="small"
																	onClick={() => {
																		setEditPrice(true);
																	}}
																>
																	<EditOutlined />
																</IconButton>
															</Box>
														) : (
															<Box display="inline-flex" alignItems="center" gap={1}>
																<OutlinedInput
																	id="price"
																	type={"number"}
																	value={editPriceValue}
																	name="price"
																	sx={{ height: "30px" }}
																	inputProps={{
																		style: { padding: 5, width: "50px" },
																	}}
																	onChange={(e) => {
																		setEditPriceValue(e.target.value);
																	}}
																/>
																<SaveOutlined
																	style={{ cursor: "pointer" }}
																	onClick={async () => {
																		setEditPrice(false);
																	}}
																/>
															</Box>
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
														<InputLabel htmlFor="unit">Disponibilidade</InputLabel>
														<RadioGroup aria-label="size" value={available ? available : available_at} name="radio-buttons-group" onChange={handleChangeAvailable} row>
															<FormControlLabel value="P" control={<Radio />} label="No pouso" />
															<FormControlLabel value="D" control={<Radio />} label="Na decolagem" />
															<FormControlLabel value="A" control={<Radio />} label="Ambos" />
														</RadioGroup>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
										<Divider />
										<Divider />
										<ListItem>
											<Grid container spacing={3}>
												<Grid item xs={12} md={6}>
													<Stack spacing={0.5}>
														<Grid display="flex" alignItems="center" gap={1}>
															<InputLabel htmlFor="stock">Controle de estoque?</InputLabel>
														</Grid>
														<RadioGroup aria-label="stock" value={stock ? stock : inventory} name="stock" onChange={handleChangeStock} row>
															<FormControlLabel value="S" control={<Radio />} label="Sim" />
															<FormControlLabel value="N" control={<Radio />} label="Não" />
														</RadioGroup>
													</Stack>
												</Grid>
											</Grid>
										</ListItem>
									</List>
									<Box sx={{ p: 2.5 }}>
										<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
											<Button
												variant="outlined"
												color="error"
												onClick={() => {
													window.history.back();
												}}
											>
												Voltar
											</Button>
											<Button variant="contained" onClick={handleSave}>
												Salvar
											</Button>
											{/* {status === "D" && user.type === "A" && (
												<Button
													variant="contained"
													color="error"
													onClick={() => {
														setOpenAlert(true);
													}}
												>
													Excluir
												</Button>
											)}
											<AlertCustomerDelete title={`o produto #${id_product}`} open={openAlert} handleClose={handleAlertClose} id={id_product} handleDelete={deleteProduct} cancel={false} /> */}
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

export default ProductDetails;
