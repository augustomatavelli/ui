import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Grid, Button, Dialog, LinearProgress } from "@mui/material";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import SearchUserByAdmin from "sections/apps/users/SearchUserByAdmin";
import { PlusOutlined } from "@ant-design/icons";
import { PopupTransition } from "components/@extended/Transitions";
import AddUser from "sections/apps/users/AddUser";
import { useNavigate } from "react-router";
import { UserFilter } from "./UserFilter";
import EmptyState from "components/feedback/EmptyState";
import TableSkeleton from "components/feedback/TableSkeleton";
import UserTableRow from "./UserTableRow";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Número ANAC", key: "license" },
];

const COLUMN_COUNT = 7;

export default function UsersTable({ openFilter, reload }) {
	const { findAllUsers, approveUser } = useUser();

	const { users, totalUser, loadingUser } = useContext(UserContext);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState({});
	const [selectedRole, setSelectedRole] = useState({});

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
		const roleParams = Object.keys(selectedRole);
		const params = new URLSearchParams();
		params.set("role", roleParams.join(","));

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));
		setOpen(false);
		await findAllUsers(search, page, params, paramsStatus);
	};

	const handleRedirect = useCallback(
		(userId) => {
			navigate(`/users/${userId}`);
		},
		[navigate],
	);

	const handleApprove = useCallback(
		async (event, user, approve) => {
			event.stopPropagation();
			await approveUser({ id_user: user.id_user, approve: approve });
			const roleParams = Object.keys(selectedRole);
			const params = new URLSearchParams();
			params.set("role", roleParams.join(","));

			const statusParams = Object.keys(selectedStatus);
			const paramsStatus = new URLSearchParams();
			paramsStatus.set("status", statusParams.join(","));
			setOpen(false);
			await findAllUsers(search, page, params, paramsStatus);
		},
		[approveUser, findAllUsers, search, page, selectedRole, selectedStatus],
	);

	useEffect(() => {
		setPage(1);
	}, [search, selectedRole, selectedStatus]);

	useEffect(() => {
		const roleParams = Object.keys(selectedRole);
		const params = new URLSearchParams();
		params.set("role", roleParams.join(","));

		const statusParams = Object.keys(selectedStatus);
		const paramsStatus = new URLSearchParams();
		paramsStatus.set("status", statusParams.join(","));

		const controller = new AbortController();
		findAllUsers(search, page, params, paramsStatus, controller.signal);

		return () => controller.abort();
	}, [search, page, selectedRole, selectedStatus, reload]);

	const isEmpty = useMemo(() => !loadingUser && users.length === 0, [loadingUser, users.length]);


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
				{openFilter && <UserFilter selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />}
				{loadingUser && <LinearProgress />}
			<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Login</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Tipo de usuário</TableCell>
							<TableCell align="center">Número ANAC</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingUser ? (
							<TableSkeleton rows={5} columns={COLUMN_COUNT} />
						) : isEmpty ? (
							<TableRow>
								<TableCell colSpan={COLUMN_COUNT}>
									<EmptyState title="Nenhum resultado encontrado" description="Nenhum usuário foi encontrado com os filtros atuais." />
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => <UserTableRow key={user.id_user} user={user} onRedirect={handleRedirect} onApprove={handleApprove} />)
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleDialogClose} open={open} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddUser onCancel={handleClose} />
			</Dialog>
		</>
	);
}

UsersTable.propTypes = {
	openFilter: PropTypes.bool,
	reload: PropTypes.bool,
};
