import PropTypes from "prop-types";
// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Dialog, Button, LinearProgress } from "@mui/material";

// project imports
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import useProduct from "hooks/useProduct";
import ProductsContext from "contexts/ProductsContext";
import SearchProductByAdmin from "sections/apps/products/SearchProductByAdmin";
import AddProduct from "sections/apps/products/AddProduct";
import { ProductFilter } from "./ProductFilter";
import { useNavigate } from "react-router";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import ProductTableRow from "./ProductTableRow";

const COLUMN_COUNT = 7;

export default function ProductsTable({ openFilter, reload }) {
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

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleClickVisibility = useCallback(
		async (productId, hidePrice) => {
			const categoriesParams = Object.keys(selectedCategory);
			const params = new URLSearchParams();
			params.set("categories", categoriesParams.join(","));

			await updateProduct(productId, { hide_price: hidePrice === "S" ? "N" : "S" });
			await findAllProducts(search, page, params);
		},
		[updateProduct, findAllProducts, search, page, selectedCategory],
	);

	const handleRedirect = useCallback(
		(productId) => {
			navigate(`/products/${productId}`);
		},
		[navigate],
	);

	useEffect(() => {
		setPage(1);
	}, [search, selectedCategory]);

	useEffect(() => {
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		const controller = new AbortController();
		Promise.all([findCategories(controller.signal), findAllProducts(search, page, params, controller.signal)]);

		return () => controller.abort();
	}, [search, page, selectedCategory, reload]);

	const isEmpty = useMemo(() => !loadingProduct && products.length === 0, [loadingProduct, products.length]);

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
				{loadingProduct && <LinearProgress />}
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
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum produto foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							products.map((e) => <ProductTableRow key={e.id_product} product={e} onRedirect={handleRedirect} onToggleVisibility={handleClickVisibility} />)
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddProduct onCancel={handleAdd} />
			</Dialog>
		</>
	);
}

ProductsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
