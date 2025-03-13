// material-ui
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, useTheme } from "@mui/material";

// project imports
import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchUser from "sections/apps/helicopters/SearchUser";
import { PlusCircleFilled } from "@ant-design/icons";
import useHelicopter from "hooks/useHelicopter";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { formatPhoneNumber } from "utils/format/formatPhoneNumber";

export const header = [
	{ label: "", key: "icon" },
	{ label: "Nome", key: "name" },
	{ label: "Email", key: "email" },
	{ label: "Celular", key: "mobile" },
	{ label: "Tipo", key: "type" },
	{ label: "Status", key: "status" },
];

// ==============================|| MUI TABLE - BASIC ||============================== //

export default function AddLinkUserHelicopterTable() {
	const { findAllUsers } = useUser();
	const { addLinkUserHelicopter } = useHelicopter();

	const { searchUser } = useContext(UserContext);

	const [value, setValue] = useState("");

	const { id } = useParams();
	const theme = useTheme();

	const handleAddLinkUserHelicopter = async (userId) => {
		const payload = { userId: userId, helicopterId: Number(id) };

		const response = await addLinkUserHelicopter(payload);
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

		await findAllUsers(value, Number(id));
	};

	useEffect(() => {
		findAllUsers(value, Number(id));
	}, [value]);

	return (
		<MainCard>
			<SearchUser setValue={setValue} />
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
						{searchUser.map((user) => (
							<TableRow hover key={user.id_user}>
								<TableCell>
									<PlusCircleFilled
										style={{
											fontSize: 20,
											color: theme.palette.primary.main,
											cursor: "pointer",
										}}
										onClick={() => {
											handleAddLinkUserHelicopter(user.id_user);
										}}
									/>
								</TableCell>
								<TableCell align="center">{user.name}</TableCell>
								<TableCell align="center">{user.email}</TableCell>
								<TableCell align="center">{formatPhoneNumber(user.mobile)}</TableCell>
								<TableCell align="center">
									<Chip color="primary" variant="filled" size="small" label={user.type === "P" ? "S" : "N"} />
								</TableCell>
								<TableCell align="center">
									<Chip
										color={user.status === "P" ? "warning" : user.status === "A" ? "success" : ""}
										variant="filled"
										size="small"
										label={user.status === "P" ? "Pendente" : user.status === "A" ? "Ativo" : ""}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</MainCard>
	);
}
