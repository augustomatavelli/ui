import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Button, Dialog, LinearProgress } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import { useNavigate } from "react-router";
import SearchOperatorByAdmin from "sections/apps/operators/SearchOperatorByAdmin";
import OperatorContext from "contexts/OperatorContext";
import useOperator from "hooks/useOperator";
import AddOperator from "sections/apps/operators/AddOperator";
import { formatCpfCnpj } from "utils/format/formatDoc";
import { formatPhoneNumber } from "utils/format/formatPhoneNumber";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Documento", key: "doc" },
];

const COLUMN_COUNT = 3;

export default function OperatorsTable({ openFilter, reload }) {
	const { findAllOperators } = useOperator();

	const { operators, totalOperators, loadingOperator } = useContext(OperatorContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleClose = async () => {
		setOpen(false);
		await findAllOperators(search, page);
	};

	const handleRedirect = (operatorId) => {
		navigate(`/operators/${operatorId}`);
	};

	useEffect(() => {
		setPage(1);
	}, [search]);

	useEffect(() => {
		const controller = new AbortController();
		findAllOperators(search, page, controller.signal);

		return () => controller.abort();
	}, [search, page, reload]);

	const isEmpty = useMemo(() => !loadingOperator && operators.length === 0, [loadingOperator, operators.length]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchOperatorByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalOperators} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleAdd}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar operador
						</Button>
					</Stack>
				</Grid>
				{/* {openFilter && <OperatorFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />} */}
				{loadingOperator && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Documento</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingOperator ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum operador foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							operators.map((operator) => (
								<TableRow
									hover
									key={operator.id_operator}
									sx={{ cursor: "pointer" }}
									onClick={() => {
										handleRedirect(operator.id_operator);
									}}
								>
									<TableCell align="center">{operator.name}</TableCell>
									<TableCell align="center">{formatPhoneNumber(operator.mobile)}</TableCell>
									<TableCell align="center">{formatCpfCnpj(operator.doc)}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddOperator onCancel={handleClose} />
			</Dialog>
		</>
	);
}

OperatorsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
