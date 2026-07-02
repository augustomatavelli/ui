import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Dialog, Switch, Button, Box, LinearProgress } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import useChecklist from "hooks/useChecklists";
import ChecklistContext from "contexts/ChecklistContext";
import SearchChecklistByAdmin from "sections/apps/checklists/SearchChecklistByAdmin";
import { PopupTransition } from "components/@extended/Transitions";
import AddChecklist from "sections/apps/checklists/AddChecklist";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

const COLUMN_COUNT = 3;

export default function ChecklistsTable({ openFilter, reload }) {
	const { findAllChecklists, toggleStatus } = useChecklist();

	const { checklists, totalChecklists, loadingChecklist } = useContext(ChecklistContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [togglingStatus, setTogglingStatus] = useState({});

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleStatusChange = async (id) => {
		setTogglingStatus((prev) => ({ ...prev, [id]: true }));
		try {
			await toggleStatus(id);
			await findAllChecklists(search, page);
		} finally {
			setTogglingStatus((prev) => ({ ...prev, [id]: false }));
		}
	};

	const handleAdd = async () => {
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
		await findAllChecklists(search, page);
	};

	useEffect(() => {
		setPage(1);
	}, [search]);

	useEffect(() => {
		const controller = new AbortController();
		findAllChecklists(search, page, controller.signal);

		return () => controller.abort();
	}, [search, page, reload]);

	const isEmpty = useMemo(() => !loadingChecklist && checklists.length === 0, [loadingChecklist, checklists.length]);


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
				{loadingChecklist && <LinearProgress />}
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
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum checklist foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							checklists.map((checklist) => (
								<TableRow hover key={checklist.id_checklist}>
									<TableCell align="center">#{checklist.id_checklist}</TableCell>
									<TableCell align="center">{checklist.name}</TableCell>
									<TableCell align="center">
										<Box display="flex" justifyContent="center" alignItems="center">
											<Switch
												checked={checklist.status === "A"}
												disabled={togglingStatus[checklist.id_checklist]}
												onChange={async () => {
													await handleStatusChange(checklist.id_checklist);
												}}
												color="primary"
											/>
										</Box>
									</TableCell>
								</TableRow>
							))
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

ChecklistsTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
