import { Grid } from "@mui/material";
import LiveRequestsHeader from "sections/apps/requests/LiveRequestHeader";
import LiveRequestTable from "sections/apps/requests/LiveRequestTable";

function LiveRequests() {
	return (
		<Grid
			container
			direction="column"
			alignItems="center"
			justifyContent="flex-start"
			sx={{
				minHeight: "100vh",
				backgroundImage: "linear-gradient(to bottom, #80C7FF, #00509E)",
			}}
		>
			<LiveRequestsHeader />
			<LiveRequestTable />
		</Grid>
	);
}

export default LiveRequests;
