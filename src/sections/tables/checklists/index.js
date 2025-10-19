import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, Stack, Grid, Dialog, Switch, Button, Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "components/Loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PlusOutlined } from "@ant-design/icons";
import useChecklist from "hooks/useChecklists";
import ChecklistContext from "contexts/ChecklistContext";
import SearchChecklistByAdmin from "sections/apps/checklists/SearchChecklistByAdmin";
import { PopupTransition } from "components/@extended/Transitions";
import AddChecklist from "sections/apps/checklists/AddChecklist";

dayjs.extend(utc);

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

export default function ChecklistsTable({ openFilter, reload }) {
	const { findAllChecklists, toggleStatus } = useChecklist();

	const { checklists, totalChecklists, loadingChecklist } = useContext(ChecklistContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleStatusChange = async (id) => {
		await toggleStatus(id);
		await findAllChecklists(search, page);
	};

	const handleAdd = async () => {
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
		await findAllChecklists(search, page);
	};

	useEffect(() => {
		findAllChecklists(search, page);
	}, [search, page, reload]);

	useEffect(() => {}, [checklists]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchChecklistByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalChecklists} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleAdd}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar checklist
						</Button>
					</Stack>
				</Grid>
				{/* {openFilter && <LogFilter selectedEntity={selectedEntity} setSelectedEntity={setSelectedEntity} selectedAction={selectedAction} setSelectedAction={setSelectedAction} />} */}
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingChecklist ? (
							<TableRow>
								<TableCell colSpan={999} align="center" sx={{ padding: 0 }}>
									<Loader />
								</TableCell>
							</TableRow>
						) : checklists.length > 0 ? (
							checklists.map((checklist) => (
								<TableRow hover key={checklist.id}>
									<TableCell align="center">#{checklist.id_checklist}</TableCell>
									<TableCell align="center">{checklist.name}</TableCell>
									<TableCell align="center">
										<Box display="flex" justifyContent="center" alignItems="center">
											<Switch
												checked={checklist.status === "A"}
												onChange={async (event) => {
													const newStatus = event.target.checked ? "A" : "I";
													await handleStatusChange(checklist.id_checklist, newStatus);
												}}
												color="primary"
											/>
										</Box>
									</TableCell>
								</TableRow>
							))
						) : search || openFilter ? (
							<TableRow>
								<TableCell colSpan={3} align="center">
									<Typography variant="h5">Nenhum checklist encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={3} align="center">
									<Typography variant="h5">Nenhum checklist registrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddChecklist onCancel={handleClose} />
			</Dialog>
		</>
	);
}
