// material-ui
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

export const UserAircraftsList = ({ data }) => {
	return (
		data &&
		data.length > 0 &&
		data.map((e) => (
			<Card key={e.id_aircraft} sx={{ width: 150, marginRight: "1rem" }}>
				<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
					<Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, maxWidth: "25%" }}>
						<Box
							sx={{
								width: "100px",
								height: "50px",
								overflow: "hidden",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<img
								src={`data:image/jpeg;base64,${e.image}`}
								alt="Aircraft"
								style={{
									width: "100px",
									height: "100%",
									objectFit: "contain",
								}}
							/>
						</Box>
						<Typography variant="subtitle1">{e.registration}</Typography>
					</Grid>
				</CardContent>
			</Card>
		))
	);
};
