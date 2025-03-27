// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, Typography, Box, Tooltip, Pagination, Stack, Grid, Button, Dialog, TextField } from "@mui/material";

// project imports
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import { useContext, useEffect, useState } from "react";
import { LikeFilled, DislikeFilled, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import SearchUserByAdmin from "sections/apps/users/SearchUserByAdmin";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import AddUser from "sections/apps/users/AddUser";
import Loader from "components/Loader";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Registro piloto", key: "pilot_register" },
];

export default function UsersTable() {
	const { findAllUsers, approveUser } = useUser();

	const { users, totalUser, loadingUser } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);

	const theme = useTheme();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	const handleAdd = async () => {
		setOpen(!open);
		await findAllUsers(search, page);
	};

	useEffect(() => {
		findAllUsers(search, page);
	}, [search, page]);

	useEffect(() => {}, [users]);

	return (
		<>
			<TableContainer>
				<Grid sx={{ p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<SearchUserByAdmin setSearch={setSearch} />
					<Stack spacing={2} sx={{ width: "100%", mb: 1 }} alignItems="center" justifyContent="flex-end" display="flex" direction="row">
						<Pagination count={totalUser} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
						<Button
							variant="contained"
							startIcon={<PlusOutlined />}
							onClick={handleAdd}
							sx={{
								height: 40,
								paddingY: 0,
							}}
						>
							Criar usuário
						</Button>
					</Stack>
				</Grid>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Tipo de usuário</TableCell>
							<TableCell align="center">Registro de piloto</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.length > 0 ? (
							users.map((user) => (
								<TableRow hover key={user.id_user}>
									<TableCell align="center">
										{user.status === "P" ? (
											<Box display="flex" gap={4} justifyContent="center">
												<Tooltip title="Aprovar">
													<LikeFilled
														style={{
															fontSize: 20,
															color: theme.palette.success.main,
															cursor: "pointer",
														}}
														onClick={async () => {
															await approveUser({ id_user: user.id_user, approve: "S" });
															await findAllUsers(search, page);
														}}
													/>
												</Tooltip>
												<Tooltip title="Rejeitar">
													<DislikeFilled
														style={{
															fontSize: 20,
															color: theme.palette.error.main,
															cursor: "pointer",
														}}
														onClick={async () => {
															await approveUser({ id_user: user.id_user, approve: "N" });
															await findAllUsers(search, page);
														}}
													/>
												</Tooltip>
											</Box>
										) : (
											<Chip color="success" variant="filled" size="small" label="Ativo" />
										)}
									</TableCell>
									<TableCell align="center">{user.name}</TableCell>
									<TableCell align="center">{user.email}</TableCell>
									<TableCell align="center">{user.mobile}</TableCell>
									<TableCell align="center">
										<Chip
											color={user.type === "P" ? "success" : user.type === "R" ? "primary" : user.type === "A" ? "info" : "warning"}
											variant="filled"
											size="small"
											label={user.type === "P" ? "Piloto" : user.type === "R" ? "Responsável" : user.type === "A" ? "Administrador" : "Comum"}
										/>
									</TableCell>
									<TableCell align="center">{user.pilot_register ? user.pilot_register : "-"}</TableCell>
								</TableRow>
							))
						) : search ? (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum usuário encontrado</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									<Typography variant="h5">Nenhum usuário cadastrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddUser onCancel={handleAdd} />
			</Dialog>
		</>
	);
}
