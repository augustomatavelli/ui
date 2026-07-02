import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, IconButton, Tooltip, Chip } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import InventoryContext from "contexts/InventoryContext";
import useInventory from "hooks/useInventory";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { formatDisplay } from "utils/date";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import ConfirmDialog from "components/feedback/ConfirmDialog";

const COLUMN_COUNT = 6;

export default function InventoryMovementsTable({ search, page, setPage, service, typeFilter }) {
	const { deleteInventory, findAllInventory } = useInventory();

	const { loadingInventory, inventory, totalInventoryItems } = useContext(InventoryContext);

	const [confirmDeleteId, setConfirmDeleteId] = useState(null);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const isEmpty = useMemo(() => !loadingInventory && inventory.length === 0, [loadingInventory, inventory.length]);

	const handleConfirmDelete = async () => {
		const id = confirmDeleteId;
		const result = await deleteInventory(id);
		if (!result) {
			setConfirmDeleteId(null);
			return;
		}
		dispatch(
			openSnackbar({
				open: true,
				message: "Ajuste removido com sucesso!",
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		setConfirmDeleteId(null);
		await findAllInventory(service, search, page, typeFilter);
	};

	return (
		<>
			<TableContainer>
				<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
					<Pagination count={totalInventoryItems} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
				</Stack>
				<Table aria-label="simple table" size="small">
					<TableHead>
						<TableRow>
							<TableCell align="center">Data</TableCell>
							<TableCell align="center">Tipo de Movimentação</TableCell>
							<TableCell align="center">Quantidade</TableCell>
							<TableCell align="center">Referência</TableCell>
							<TableCell align="center">Observação</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingInventory ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhuma movimentação foi encontrada." />
								</TableCell>
							</TableRow>
						) : (
							inventory.map((i) => (
								<TableRow hover key={i.id}>
									<TableCell align="center">{formatDisplay(i.created_at)}</TableCell>
									<TableCell align="center">
										<Chip
											color={i.type === "E" ? "success" : i.type === "S" ? "warning" : "error"}
											variant="filled"
											size="small"
											label={i.type === "E" ? "Entrada" : i.type === "S" ? "Saída" : "Ajuste"}
											sx={{ color: i.type === "S" ? "#252525" : "white" }}
										/>
									</TableCell>
									<TableCell align="center">{i.amount}</TableCell>
									<TableCell align="center">{i.id_request && i.registration ? `#${i.id_request} / ${i.registration}` : i.created_by}</TableCell>
									<TableCell align="center">{i.observation ? i.observation : "-"}</TableCell>
									<TableCell align="center">
										{i.type === "A" ? (
											<Tooltip title="Remover Ajuste">
												<IconButton aria-label="Remover ajuste" onClick={() => setConfirmDeleteId(i.id)} size="small">
													<DeleteOutlined style={{ color: "red" }} />
												</IconButton>
											</Tooltip>
										) : (i.type === "E" || i.type === "S") && i.receipt ? (
											<Tooltip title="Visualizar">
												<IconButton size="small" onClick={() => window.open(i.receipt)}>
													<EyeOutlined style={{ color: "green" }} />
												</IconButton>
											</Tooltip>
										) : null}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<ConfirmDialog
				open={confirmDeleteId !== null}
				title="Remover ajuste"
				description="Tem certeza que deseja remover este ajuste de estoque? Esta ação não poderá ser desfeita."
				confirmText="Remover"
				loading={loadingInventory}
				onClose={() => setConfirmDeleteId(null)}
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
}

InventoryMovementsTable.propTypes = {
	search: PropTypes.string,
	page: PropTypes.number,
	setPage: PropTypes.func,
	service: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	typeFilter: PropTypes.string,
};
