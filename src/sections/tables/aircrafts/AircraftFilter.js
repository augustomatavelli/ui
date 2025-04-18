import { Box, Stack, Chip, useTheme, Typography } from "@mui/material";

export const AircraftFilter = ({ selectedStatus, setSelectedStatus }) => {
	const theme = useTheme();

	const aircraftStatus = ["A", "P"];

	return (
		<Box sx={{ display: "flex", px: 2.5, mb: 2.5, gap: 1, flexDirection: "column" }}>
			<Typography variant="subtitle1">Por status</Typography>
			{aircraftStatus.length > 0 && (
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
					{aircraftStatus.map((e) => (
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
	);
};
