import { Box, Stack, Chip, useMediaQuery, useTheme, Typography, Grid } from "@mui/material";

export const LogFilter = ({ selectedEntity, setSelectedEntity, selectedAction, setSelectedAction }) => {
	const theme = useTheme();

	const entities = ["A", "P", "S", "AD", "U", "R", "I", "O"];
	const action = ["C", "E", "D", "A"];

	return (
		<Grid sx={{ display: "flex", mx: 2.5, mt: 0, mb: 2.5, gap: 5 }}>
			<Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
				<Typography variant="subtitle1">Por entidade</Typography>
				{entities.length > 0 && (
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
						{entities.map((e) => (
							<Chip
								key={e}
								label={
									e === "A"
										? "Aeronave"
										: e === "P"
											? "Produto"
											: e === "S"
												? "Serviço"
												: e === "AD"
													? "Aeródromo"
													: e === "U"
														? "Usuário"
														: e === "R"
															? "Solicitação"
															: e === "I"
																? "Inspeção"
																: "Operador"
								}
								color={selectedEntity[e] ? "primary" : "default"}
								sx={{ fontWeight: "bold", color: selectedEntity[e] ? "white" : theme.palette.action.active }}
								onClick={() => {
									setSelectedEntity((prev) => {
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
				<Typography variant="subtitle1">Por ação</Typography>
				{action.length > 0 && (
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
						{action.map((e) => (
							<Chip
								key={e}
								label={e === "A" ? "Aprovar" : e === "C" ? "Criar" : e === "E" ? "Editar" : "Excluir"}
								color={selectedAction[e] ? "primary" : "default"}
								sx={{ fontWeight: "bold", color: selectedAction[e] ? "white" : theme.palette.action.active }}
								onClick={() => {
									setSelectedAction((prev) => {
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
