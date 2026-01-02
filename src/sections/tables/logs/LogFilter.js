import { Box, Stack, Chip, useTheme, Typography } from "@mui/material";

export const LogFilter = ({ selectedEntity, setSelectedEntity, selectedAction, setSelectedAction }) => {
	const theme = useTheme();

	const entities = ["A", "P", "S", "AD", "U", "R", "I", "O"];
	const action = ["C", "E", "D", "A"];

	return (
		<Box
			sx={{
				mx: 2.5,
				mb: 2.5,
				py: 2,
				px: 2.5,
				backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
				borderRadius: 1.5,
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
				<Stack spacing={1} sx={{ minWidth: 180 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							color: theme.palette.text.secondary,
							fontSize: "0.8125rem",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						Entidade
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
								size="small"
								color={selectedEntity[e] ? "primary" : "default"}
								variant={selectedEntity[e] ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: selectedEntity[e] ? 2 : 1,
									},
								}}
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
				</Stack>

				<Stack spacing={1} sx={{ minWidth: 180 }}>
					<Typography
						variant="body2"
						sx={{
							fontWeight: 600,
							color: theme.palette.text.secondary,
							fontSize: "0.8125rem",
							textTransform: "uppercase",
							letterSpacing: 0.5,
						}}
					>
						Ação
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{action.map((e) => (
							<Chip
								key={e}
								label={e === "A" ? "Aprovar" : e === "C" ? "Criar" : e === "E" ? "Editar" : "Excluir"}
								size="small"
								color={selectedAction[e] ? "primary" : "default"}
								variant={selectedAction[e] ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: selectedAction[e] ? 2 : 1,
									},
								}}
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
				</Stack>
			</Stack>
		</Box>
	);
};
