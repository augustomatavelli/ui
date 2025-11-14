import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import Loader from "components/Loader";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";

const mockMovements = [
	{ id: 1, date: "2025-11-13T10:00:00Z", type: "Entrada", finalBalance: 100, reference: "Nota Fiscal #123" },
	{ id: 2, date: "2025-11-12T15:30:00Z", type: "Saída", finalBalance: 90, reference: "Requisição #456" },
	{ id: 3, date: "2025-11-12T09:00:00Z", type: "Ajuste", finalBalance: 95, reference: "augustomatavelli" },
	{ id: 4, date: "2025-11-11T11:00:00Z", type: "Saída", finalBalance: 105, reference: "Aeronave PR-ABC" },
	{ id: 5, date: "2025-11-10T18:00:00Z", type: "Entrada", finalBalance: 110, reference: "Nota Fiscal #122" },
];

export default function InventoryMovementsTable() {
	const [loading] = useState(false);
	const [page, setPage] = useState(1);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleDelete = (id) => {
		console.log(`Delete movement ${id}`);
	};

	return (
		<>
			<TableContainer>
				<Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
					<Pagination count={Math.ceil(mockMovements.length / 10)} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
				</Stack>
				<Table aria-label="simple table" size="small">
					<TableHead>
						<TableRow>
							<TableCell align="center">Data</TableCell>
							<TableCell align="center">Tipo de Movimentação</TableCell>
							<TableCell align="center">Quantidade</TableCell>
							<TableCell align="center">Saldo Final</TableCell>
							<TableCell align="center">Referência</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Loader />
								</TableCell>
							</TableRow>
						) : mockMovements.length > 0 ? (
							mockMovements.map((movement) => (
								<TableRow hover key={movement.id}>
									<TableCell align="center">{dayjs(movement.date).format("DD/MM/YYYY HH:mm")}</TableCell>
									<TableCell align="center">{movement.type}</TableCell>
									<TableCell align="center">{movement.finalBalance}</TableCell>
									<TableCell align="center">{movement.amount}</TableCell>
									<TableCell align="center">{movement.reference}</TableCell>
									<TableCell align="center">
										{movement.type === "Ajuste" && (
											<Tooltip title="Remover Ajuste">
												<IconButton onClick={() => handleDelete(movement.id)} size="small">
													<DeleteOutlined style={{ color: "red" }} />
												</IconButton>
											</Tooltip>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
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
