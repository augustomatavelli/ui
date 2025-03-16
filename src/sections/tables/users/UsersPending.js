// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, Typography, Box, Tooltip, Pagination, Stack, Grid } from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import { useContext, useEffect, useState } from "react";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";
import { formatPhoneNumber } from "utils/format/formatPhoneNumber";
import SearchUserPending from "sections/apps/aircrafts/SearchUserPending";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function UserPendingTable() {
	const { findAllPendingUsers, approveUser } = useUser();

	const { usersPending, totalUserPending } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const theme = useTheme();

	const handleChangePage = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		findAllPendingUsers(search, page);
	}, [search, page]);

	useEffect(() => {}, [usersPending]);

	return (
		<MainCard>
			<Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<SearchUserPending setSearch={setSearch} />
				<Stack spacing={2} sx={{ p: 2.5, width: "100%", mb: 1 }} alignItems="flex-end">
					<Pagination count={totalUserPending} size="medium" page={page} showFirstButton showLastButton variant="combined" color="primary" onChange={handleChangePage} />
				</Stack>
			</Grid>
			<TableContainer>
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
						{usersPending.length > 0 ? (
							usersPending.map((user) => (
								<TableRow hover key={user.id_user}>
									<TableCell align="center">
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
														await findAllPendingUsers(search, page);
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
														await findAllPendingUsers(search, page);
													}}
												/>
											</Tooltip>
										</Box>
									</TableCell>
									<TableCell align="center">{user.name}</TableCell>
									<TableCell align="center">{user.email}</TableCell>
									<TableCell align="center">{formatPhoneNumber(user.mobile)}</TableCell>
									<TableCell align="center">
										<Chip
											color={user.type === "P" ? "success" : user.type === "R" ? "primary" : "warning"}
											variant="filled"
											size="small"
											label={user.type === "P" ? "Piloto" : user.type === "R" ? "Responsável" : "Comum"}
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
									<Typography variant="h5">Nenhum usuário pendente</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</MainCard>
	);
}
