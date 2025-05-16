import { Box, Stack, Chip, useMediaQuery, useTheme, Typography, Grid } from "@mui/material";

export const UserFilter = ({ selectedStatus, setSelectedStatus, selectedRole, setSelectedRole }) => {
	const theme = useTheme();

	const userStatus = ["A", "P"];
	const userRole = ["A", "P", "R", "C"];

	return (
		<Grid sx={{ display: "flex", mx: 2.5, mt: 0, mb: 2.5, gap: 5 }}>
			<Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
				<Typography variant="subtitle1">Por status</Typography>
				{userStatus.length > 0 && (
					<Stack
						direction="row"
						spacing={1}
						sx={{
							overflowX: "auto",
							whiteSpace: "nowrap",
							scrollbarWidth: "thin",
							"&::-webkit-scrollbar": {
								height: "6px",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "#ccc",
								borderRadius: "4px",
							},
						}}
					>
						{userStatus.map((e) => (
							<Chip
								key={e}
								label={e === "P" ? "Pendente" : "Ativo"}
								color={selectedStatus[e] ? "primary" : "default"}
								sx={{ fontWeight: "bold", color: selectedStatus[e] ? "white" : theme.palette.action.active }}
								onClick={() => {
									setSelectedStatus((prev) => {
										const newSelected = { ...prev };
										if (newSelected[e]) {
											delete newSelected[e];
										} else {
											newSelected[e] = true;
										}
										return newSelected;
									});
								}}
							/>
						))}
					</Stack>
				)}
			</Box>
			<Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
				<Typography variant="subtitle1">Por tipo de usuário</Typography>
				{userRole.length > 0 && (
					<Stack
						direction="row"
						spacing={1}
						sx={{
							overflowX: "auto",
							whiteSpace: "nowrap",
							scrollbarWidth: "thin",
							"&::-webkit-scrollbar": {
								height: "6px",
							},
							"&::-webkit-scrollbar-thumb": {
								backgroundColor: "#ccc",
								borderRadius: "4px",
							},
						}}
					>
						{userRole.map((e) => (
							<Chip
								key={e}
								label={e === "A" ? "Administrador" : e === "P" ? "Piloto" : e === "R" ? "Operador" : "Comum"}
								color={selectedRole[e] ? "primary" : "default"}
								sx={{ fontWeight: "bold", color: selectedRole[e] ? "white" : theme.palette.action.active }}
								onClick={() => {
									setSelectedRole((prev) => {
										const newSelected = { ...prev };
										if (newSelected[e]) {
											delete newSelected[e];
										} else {
											newSelected[e] = true;
										}
										return newSelected;
									});
								}}
							/>
						))}
					</Stack>
				)}
			</Box>
		</Grid>
	);
};
