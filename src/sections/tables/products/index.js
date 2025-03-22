// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Chip, Button } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import useProduct from "hooks/useProduct";
import ProductsContext from "contexts/ProductsContext";
import SearchProductByAdmin from "sections/apps/products/SearchProductByAdmin";
import AddProduct from "sections/apps/products/AddProduct";

export default function ProductsTable() {
	const { findAllProducts } = useProduct();

	const { products, totalProducts } = useContext(ProductsContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		setOpen(!open);
		await findAllProducts(search, page);
	};

	useEffect(() => {
		findAllProducts(search, page);
	}, [search, page]);

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
						{products.length > 0 ? (
							products.map((e) => (
								<TableRow hover key={e.product}>
									<TableCell align="center">
										<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_product}`} />
									</TableCell>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">
										<Chip color={e.category_name === "Bebida" ? "success" : "warning"} variant="filled" size="small" label={e.category_name} />
									</TableCell>
									<TableCell align="center">{e.price}</TableCell>
									<TableCell align="center">{e.unit}</TableCell>
									<TableCell align="center">
										<Chip color={e.status === "D" ? "success" : "error"} variant="filled" size="small" label={e.status === "D" ? "Disponível" : "Indisponível"} />
									</TableCell>
									<TableCell align="center">{e.created_by}</TableCell>
								</TableRow>
							))
						) : search ? (
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
