import { Box, Stack, Chip, useMediaQuery, useTheme, Typography } from "@mui/material";
import OperationsContext from "contexts/OperationContext";
import { useContext } from "react";

export const OperationFilter = ({ selectedCategory, setSelectedCategory }) => {
	const { categories } = useContext(OperationsContext);

	const theme = useTheme();

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
						Categoria
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{categories.map((e) => (
							<Chip
								key={e.id_category}
								label={e.name}
								size="small"
								color={selectedCategory[e.id_category] ? "primary" : "default"}
								variant={selectedCategory[e.id_category] ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: selectedCategory[e.id_category] ? 2 : 1,
									},
								}}
								onClick={() => {
									setSelectedCategory((prev) => {
										const newSelected = { ...prev };
										if (newSelected[e.id_category]) {
											delete newSelected[e.id_category];
										} else {
											newSelected[e.id_category] = true;
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
