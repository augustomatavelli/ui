import PropTypes from "prop-types";
import { memo } from "react";
import { Grid, ListItem, Typography, Divider, Box, Button, Chip, Collapse, Skeleton, List } from "@mui/material";
import { UpOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { ProductsList } from "sections/apps/requests/ProductsList";

const scrollBoxSx = {
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
};

const RequestProductsSection = ({
	open,
	setOpen,
	openAddProducts,
	setOpenAddProducts,
	loadingProduct,
	editRequest,
	status,
	searchProducts,
	searchAllProducts,
	handleOpenEditInput,
	handleDeleteProduct,
	handleAddProduct,
	handleChangeProductAmount,
	handleRemoveProduct,
}) => {
	return (
		<>
			<ListItem onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={6}>
						<Typography color="secondary">Produtos</Typography>
					</Grid>
					<Grid item xs={6} display="flex" justifyContent="flex-end">
						<Button type="secondary" onClick={() => setOpen(!open)} color="secondary">
							{open ? <UpOutlined /> : <DownOutlined />}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Collapse in={open}>
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
										<Box sx={scrollBoxSx}>
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
		</>
	);
};

RequestProductsSection.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	openAddProducts: PropTypes.bool,
	setOpenAddProducts: PropTypes.func,
	loadingProduct: PropTypes.bool,
	editRequest: PropTypes.object,
	status: PropTypes.string,
	searchProducts: PropTypes.array,
	searchAllProducts: PropTypes.func,
	handleOpenEditInput: PropTypes.func,
	handleDeleteProduct: PropTypes.func,
	handleAddProduct: PropTypes.func,
	handleChangeProductAmount: PropTypes.func,
	handleRemoveProduct: PropTypes.func,
};

export default memo(RequestProductsSection);
