import { Box, Stack, Chip, useTheme, Typography } from "@mui/material";

export const NotificationFilter = ({ selectedStatus, setSelectedStatus }) => {
	const theme = useTheme();

	const status = ["T", "R", "U"];

	return (
		<Box sx={{ display: "flex", px: 2.5, mb: 2.5, gap: 1, flexDirection: "column" }}>
			<Typography variant="subtitle1">Por status</Typography>
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
				{status.map((e) => (
					<Chip
						key={e}
						label={e === "T" ? "Todos" : e === "R" ? "Lidas" : "Não lidas"}
						color={selectedStatus === e ? "primary" : "default"}
						sx={{ fontWeight: "bold", color: selectedStatus === e ? "white" : theme.palette.action.active }}
						onClick={() => {
							setSelectedStatus(e);
						}}
					/>
				))}
			</Stack>
		</Box>
	);
};
