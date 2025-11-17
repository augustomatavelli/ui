import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import Loader from "components/Loader";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import InventoryContext from "contexts/InventoryContext";
import useInventory from "hooks/useInventory";

export default function InventoryMovementsTable({ setSearch, search, page, setPage, service, typeFilter }) {
	const { deleteInventory, findAllInventory } = useInventory();

	const { loadingInventory, inventory, totalInventoryItems } = useContext(InventoryContext);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleDelete = async (id) => {
		await deleteInventory(id);
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
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Loader />
								</TableCell>
							</TableRow>
						) : inventory.length > 0 ? (
							inventory.map((i) => (
								<TableRow hover key={i.id}>
									<TableCell align="center">{dayjs(i.created_at).format("DD/MM/YYYY HH:mm")}</TableCell>
									<TableCell align="center">{i.type === "E" ? "Entrada" : i.type === "S" ? "Saída" : "Ajuste"}</TableCell>
									<TableCell align="center">{i.amount}</TableCell>
									<TableCell align="center">{i.created_by ? i.created_by : `#${i.id_request} - ${i.registration}`}</TableCell>
									<TableCell align="center">{i.observation ? i.observation : "-"}</TableCell>
									<TableCell align="center">
										{i.type === "A" && (
											<Tooltip title="Remover Ajuste">
												<IconButton onClick={() => handleDelete(i.id)} size="small">
													<DeleteOutlined style={{ color: "red" }} />
												</IconButton>
											</Tooltip>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhuma movimentação encontrada</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
