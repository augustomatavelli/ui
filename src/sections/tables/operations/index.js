import PropTypes from "prop-types";
// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Dialog, Button, LinearProgress } from "@mui/material";

// project imports
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PopupTransition } from "components/@extended/Transitions";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import SearchOperationByAdmin from "sections/apps/operations/SearchOperationByAdmin";
import AddOperation from "sections/apps/operations/AddOperation";
import { PlusOutlined } from "@ant-design/icons";
import { OperationFilter } from "./OperationFilter";
import { useNavigate } from "react-router";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import OperationTableRow from "./OperationTableRow";

const COLUMN_COUNT = 7;

export default function OperationsTable({ openFilter, reload }) {
	const { findAllOperations, findCategories } = useOperation();

	const { operations, totalOperations, loadingOperation } = useContext(OperationsContext);

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
		await findAllOperations(search, page, params);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleRedirect = useCallback(
		(productId) => {
			navigate(`/operations/${productId}`);
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
		Promise.all([findCategories(controller.signal), findAllOperations(search, page, params, controller.signal)]);

		return () => controller.abort();
	}, [search, page, selectedCategory, reload]);

	const isEmpty = useMemo(() => !loadingOperation && operations.length === 0, [loadingOperation, operations.length]);

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
				{loadingOperation && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome do serviço</TableCell>
							<TableCell align="center">Categoria</TableCell>
							<TableCell align="center">Preço unitário</TableCell>
							<TableCell align="center">Unidade de medida</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="center">Criado por</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingOperation ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum serviço foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							operations.map((e) => <OperationTableRow key={e.id_service} operation={e} onRedirect={handleRedirect} />)
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddOperation onCancel={handleAdd} />
			</Dialog>
		</>
	);
}

OperationsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
