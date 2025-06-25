// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme, Typography } from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchUser from "sections/apps/users/SearchUser";
import { MinusCircleFilled } from "@ant-design/icons";
import useAircraft from "hooks/useAircraft";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import AircraftContext from "contexts/AircraftContext";
import Loader from "components/Loader";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Status", key: "status" },
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function ConfirmRemoveLinkUserAircraftTable() {
	const { searchAllUsers } = useUser();
	const { removeLinkUserAircraft } = useAircraft();

	const { searchUser, loadingUser } = useContext(UserContext);
	const { searchUserAircraftLink, loadingAircraft } = useContext(AircraftContext);

	const { id } = useParams();
	const theme = useTheme();

	const handleRemoveLinkUserAircraft = async (userId) => {
		const response = await removeLinkUserAircraft(userId, Number(id));
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			})
		);
		await searchAllUsers(searchUserAircraftLink, Number(id), true);
	};

	useEffect(() => {
		searchAllUsers(searchUserAircraftLink, Number(id), true);
	}, [searchUserAircraftLink]);

	return (
		<MainCard>
			<SearchUser />
			<TableContainer>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell align="center">Nome</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Celular</TableCell>
							<TableCell align="center">Piloto</TableCell>
							<TableCell align="center">Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingUser || loadingAircraft ? (
							<Loader />
						) : searchUser.length > 0 ? (
							searchUser.map((user) => (
								<TableRow hover key={user.id_user}>
									<TableCell align="center">
										<MinusCircleFilled
											style={{
												fontSize: 20,
												color: theme.palette.error.main,
												cursor: "pointer",
											}}
											onClick={() => {
												handleRemoveLinkUserAircraft(user.id_user);
											}}
										/>
									</TableCell>
									<TableCell align="center">{user.name}</TableCell>
									<TableCell align="center">{user.email}</TableCell>
									<TableCell align="center">{user.mobile}</TableCell>
									<TableCell align="center">
										<Chip color="primary" variant="filled" size="small" label={user.type === "P" ? "S" : "N"} />
									</TableCell>
									<TableCell align="center">
										<Chip
											color={user.status === "P" ? "warning" : user.status === "A" ? "success" : ""}
											variant="filled"
											size="small"
											label={user.status === "P" ? "Pendente" : user.status === "A" ? "Ativo" : ""}
											sx={{ color: user.status === "P" ? "#252525" : "white" }}
										/>
									</TableCell>
								</TableRow>
							))
						) : searchUserAircraftLink === "" ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<Typography variant="h5">Pesquise por um usuário</Typography>
								</TableCell>
							</TableRow>
						) : (
							<TableRow>
								<TableCell colSpan={6} align="center">
									<Typography variant="h5">Nenhum usuário encontrado</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</MainCard>
	);
}
