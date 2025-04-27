// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Chip, Button, Tooltip, IconButton } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import { PlusOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import useProduct from "hooks/useProduct";
import ProductsContext from "contexts/ProductsContext";
import SearchProductByAdmin from "sections/apps/products/SearchProductByAdmin";
import AddProduct from "sections/apps/products/AddProduct";
import Loader from "components/Loader";
import { ProductFilter } from "./ProductFilter";
import { useNavigate } from "react-router";

export default function ProductsTable({ openFilter }) {
	const { findAllProducts, updateProduct, findCategories } = useProduct();

	const { products, totalProducts, loadingProduct } = useContext(ProductsContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState({});

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));
		setOpen(!open);
		await findAllProducts(search, page, params);
	};

	const handleClickVisibility = async (productId, hidePrice) => {
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		await updateProduct(productId, { hide_price: hidePrice === "S" ? "N" : "S" });
		await findAllProducts(search, page, params);
	};

	const handleRedirect = (productId) => {
		navigate(`/products/${productId}`);
	};

	useEffect(() => {
		findCategories();
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		findAllProducts(search, page, params);
	}, [search, page, selectedCategory]);

	useEffect(() => {}, [products]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchProductByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalProducts} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleAdd}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar produto
						</Button>
					</Stack>
				</Grid>
				{openFilter && <ProductFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome do produto</TableCell>
							<TableCell align="center">Categoria</TableCell>
							<TableCell align="center">Preço unitário</TableCell>
							<TableCell align="center">Unidade de medida</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Criado por</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingProduct ? (
							<Loader />
						) : products.length > 0 ? (
							products.map((e) => (
								<TableRow
									hover
									key={e.id_product}
									sx={{ cursor: "pointer" }}
									onClick={() => {
										handleRedirect(e.id_product);
									}}
								>
									<TableCell align="center">
										<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_product}`} />
									</TableCell>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">
										<Chip color="warning" variant="filled" size="small" label={e.category_name} sx={{ color: "black" }} />
									</TableCell>
									<TableCell align="center">
										<>
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											}).format(e.price)}{" "}
											<Tooltip title={e.hide_price === "S" ? "Mostrar" : "Esconder"}>
												<IconButton
													onClick={(e) => {
														e.stopPropagation();
														handleClickVisibility(e.id_product, e.hide_price);
													}}
													edge="end"
													color={e.hide_price === "S" ? "error" : "success"}
												>
													{e.hide_price === "S" ? <EyeInvisibleOutlined style={{ fontSize: 20, fontWeight: "bold" }} /> : <EyeOutlined style={{ fontSize: 20, fontWeight: "bold" }} />}
												</IconButton>
											</Tooltip>
										</>
									</TableCell>
									<TableCell align="center">{e.unit}</TableCell>
									<TableCell align="center">
										<Chip color={e.status === "D" ? "success" : "error"} variant="filled" size="small" label={e.status === "D" ? "Disponível" : "Indisponível"} />
									</TableCell>
									<TableCell align="center">{e.created_by}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum produto encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum produto cadastrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddProduct onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
