import { memo } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Chip, Box, Tooltip, Typography, useTheme } from "@mui/material";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";

function UserTableRow({ user, onRedirect, onApprove }) {
	const theme = useTheme();

	return (
		<TableRow
			hover
			sx={{ cursor: "pointer" }}
			onClick={() => {
				onRedirect(user.id_user);
			}}
		>
			<TableCell align="center">
				{user.status === "P" ? (
					<Box display="flex" gap={4} justifyContent="center">
						<Tooltip title="Aprovar">
							<LikeFilled
								role="button"
								aria-label="Aprovar usuário"
								style={{
									fontSize: 20,
									color: theme.palette.success.main,
									cursor: "pointer",
								}}
								onClick={async (event) => {
									await onApprove(event, user, "S");
								}}
							/>
						</Tooltip>
						<Tooltip title="Rejeitar">
							<DislikeFilled
								role="button"
								aria-label="Rejeitar usuário"
								style={{
									fontSize: 20,
									color: theme.palette.error.main,
									cursor: "pointer",
								}}
								onClick={async (event) => {
									await onApprove(event, user, "N");
								}}
							/>
						</Tooltip>
					</Box>
				) : (
					<Chip color="success" variant="filled" size="small" label="Ativo" />
				)}
			</TableCell>
			<TableCell align="center">{user.name}</TableCell>
			<TableCell align="center">{user.email ? user.email : "-"} </TableCell>
			<TableCell align="center">{user.login ? user.login : "-"}</TableCell>
			<TableCell align="center">{user.mobile}</TableCell>
			<TableCell align="center">
				<Chip
					color={user.type === "P" ? "success" : user.type === "O" ? "primary" : user.type === "A" ? "error" : "warning"}
					variant="filled"
					size="small"
					label={user.type === "P" ? "Piloto" : user.type === "O" ? "Operador" : user.type === "A" ? "Administrador" : "Comum"}
					sx={{ color: user.type === "C" ? "#252525" : "white" }}
				/>
			</TableCell>
			<TableCell align="center">{user?.license ?? <Typography>-</Typography>}</TableCell>
		</TableRow>
	);
}

UserTableRow.propTypes = {
	user: PropTypes.object.isRequired,
	onRedirect: PropTypes.func.isRequired,
	onApprove: PropTypes.func.isRequired,
};

export default memo(UserTableRow);
