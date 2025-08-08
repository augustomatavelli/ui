import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Button, Dialog } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import Loader from "components/Loader";
import { useNavigate } from "react-router";
import { OperatorFilter } from "./OperatorFilter";
import SearchOperatorByAdmin from "sections/apps/operators/SearchOperatorByAdmin";
import OperatorContext from "contexts/OperatorContext";
import useOperator from "hooks/useOperator";
import AddOperator from "sections/apps/operators/AddOperator";
import { formatCpfCnpj } from "utils/format/formatDoc";
import { formatPhoneNumber } from "utils/format/formatPhoneNumber";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Documento", key: "doc" },
];

export default function OperatorsTable({ openFilter }) {
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

	const handleClose = async () => {
		setOpen(false);
		await findAllOperators(search, page);
	};

	const handleRedirect = (operatorId) => {
		navigate(`/operators/${operatorId}`);
	};

	useEffect(() => {
		findAllOperators(search, page);
	}, [search, page]);

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
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Documento</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingOperator ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : operators.length > 0 ? (
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
									<TableCell align="center">{operator.email}</TableCell>
									<TableCell align="center">{formatPhoneNumber(operator.mobile)}</TableCell>
									<TableCell align="center">{formatCpfCnpj(operator.doc)}</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum operador encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum operador cadastrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddOperator onCancel={handleClose} />
			</Dialog>
		</>
	);
}
