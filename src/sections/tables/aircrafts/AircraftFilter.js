import { Box, Stack, Chip, useTheme, Typography } from "@mui/material";

export const AircraftFilter = ({ selectedStatus, setSelectedStatus }) => {
	const theme = useTheme();

	const aircraftStatus = ["A", "P"];

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
						Status
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{aircraftStatus.map((e) => (
							<Chip
								key={e}
								label={e === "P" ? "Pendente" : "Ativo"}
								size="small"
								color={selectedStatus[e] ? "primary" : "default"}
								variant={selectedStatus[e] ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: selectedStatus[e] ? 2 : 1,
									},
								}}
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
				</Stack>
			</Stack>
		</Box>
	);
};
