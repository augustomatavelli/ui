import { Box, Stack, Chip } from "@mui/material";

export const NotificationMarkAsRead = ({ handleUpdate }) => {
	const status = ["R", "U"];

	return (
		<Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
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
						label={e === "R" ? "Marcar como lida" : "Marcar como não lida"}
						variant="outlined"
						sx={{
							backgroundColor: "white",
							"&:hover": {
								backgroundColor: "#f5f5f5",
							},
						}}
						onClick={() => {
							handleUpdate(e);
						}}
					/>
				))}
			</Stack>
		</Box>
	);
};
