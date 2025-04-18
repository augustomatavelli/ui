import { Box, Stack, Chip, useMediaQuery, useTheme, Typography } from "@mui/material";

export const RequestFilter = ({ selectedStatus, setSelectedStatus }) => {
	const theme = useTheme();

	const requestStatus = ["A", "F", "C"];

	return (
		<Box sx={{ display: "flex", px: 2.5, mb: 2.5, gap: 1, flexDirection: "column" }}>
			<Typography variant="subtitle1">Por status</Typography>
			{requestStatus.length > 0 && (
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
					{requestStatus.map((e) => (
						<Chip
							key={e}
							label={e === "A" ? "Em aberto" : e === "F" ? "Finalizado" : "Cancelado"}
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
