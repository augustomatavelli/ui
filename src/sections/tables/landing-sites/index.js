// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Button, Dialog, Chip, LinearProgress } from "@mui/material";

// project imports
import { useContext, useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import useLandingSite from "hooks/useLandingSite";
import LandingSiteContext from "contexts/LandingSiteContext";
import AddLandingSite from "sections/apps/landing-sites/AddLandingSite";
import SearchLandingSiteByAdmin from "sections/apps/landing-sites/SearchLandingSiteByAdmin";
import { useNavigate } from "react-router";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Tipo", key: "type" },
	{ label: "Capacidade", key: "capacity" },
	{ label: "Tipo", key: "type" },
];

const COLUMN_COUNT = 6;

export default function LandingSitesTable() {
	const { findAllLandingSites } = useLandingSite();

	const { landingSites, totalLandingSites, loadingLandingSite } = useContext(LandingSiteContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const navigate = useNavigate();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = async () => {
		setOpen(false);
		await findAllLandingSites(search, page);
	};

	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleRedirect = (landingSiteId) => {
		navigate(`/landing-sites/${landingSiteId}`);
	};

	useEffect(() => {
		setPage(1);
	}, [search]);

	useEffect(() => {
		const controller = new AbortController();
		findAllLandingSites(search, page, controller.signal);

		return () => controller.abort();
	}, [search, page]);

	const isEmpty = useMemo(() => !loadingLandingSite && landingSites.length === 0, [loadingLandingSite, landingSites.length]);


	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchLandingSiteByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalLandingSites} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleOpen}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar helicentro
						</Button>
					</Stack>
				</Grid>
				{loadingLandingSite && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Tipo</TableCell>
							<TableCell align="center">Endereço</TableCell>
							<TableCell align="center">Cidade / Estado</TableCell>
							<TableCell align="center">Capacidade</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingLandingSite ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum helicentro foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							landingSites.map((e) => (
								<TableRow
									hover
									key={e.id_landing_site}
									sx={{ cursor: "pointer" }}
									onClick={() => {
										handleRedirect(e.id_landing_site);
									}}
								>
									<TableCell align="center">
										<Chip
											color={e.status === "P" ? "warning" : "success"}
											variant="filled"
											size="small"
											label={e.status === "P" ? "Pendente" : "Ativo"}
											sx={{ color: e.status === "P" ? "#252525" : "white" }}
										/>
									</TableCell>
									<TableCell align="center">{e.name}</TableCell>
									<TableCell align="center">{e.type === "H" ? "Heliporto" : "-"}</TableCell>
									<TableCell align="center">{e.endereco}</TableCell>
									<TableCell align="center">{e.cidade}</TableCell>
									<TableCell align="center">{e.capacity}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddLandingSite onCancel={handleClose} />
			</Dialog>
		</>
	);
}
