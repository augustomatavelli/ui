// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Chip, Button } from "@mui/material";

// project imports
import { useContext, useEffect, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import SearchOperationByAdmin from "sections/apps/operations/SearchOperationByAdmin";
import AddOperation from "sections/apps/operations/AddOperation";
import { PlusOutlined } from "@ant-design/icons";
import Loader from "components/Loader";
import { OperationFilter } from "./OperationFilter";

export default function OperationsTable({ openFilter }) {
	const { findAllOperations, findCategories } = useOperation();

	const { operations, totalOperations, loadingOperation } = useContext(OperationsContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState({});

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		setOpen(!open);
		await findAllOperations(search, page, params);
	};

	useEffect(() => {
		findCategories();
		const categoriesParams = Object.keys(selectedCategory);
		const params = new URLSearchParams();
		params.set("categories", categoriesParams.join(","));

		findAllOperations(search, page, params);
	}, [search, page, selectedCategory]);

	useEffect(() => {}, [operations]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchOperationByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalOperations} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleAdd}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar serviço
						</Button>
					</Stack>
				</Grid>
				{openFilter && <OperationFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
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
						{loadingOperation ? (
							<Loader />
						) : operations.length > 0 ? (
							operations.map((e) => (
								<TableRow hover key={e.id_service}>
									<TableCell align="center">
										<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_service}`} />
									</TableCell>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">
										<Chip color="warning" variant="filled" size="small" label={e.category_name} sx={{ color: "black" }} />
									</TableCell>
									<TableCell align="center">
										{new Intl.NumberFormat("pt-BR", {
											style: "currency",
											currency: "BRL",
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}).format(e.price)}
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
									<Typography variant="h5">Nenhum serviço encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum serviço cadastrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddOperation onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
