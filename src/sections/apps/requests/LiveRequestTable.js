import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from "@mui/material";

import { useContext, useEffect } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import { format } from "date-fns";
import Loader from "components/Loader";

export default function RequestsTable() {
	const { findAllLiveRequests } = useRequest();

	const { liveRequests, loadingRequest } = useContext(RequestContext);

	useEffect(() => {
		findAllLiveRequests();

		const intervalId = setInterval(() => {
			findAllLiveRequests();
		}, 60000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<TableContainer>
				<Table aria-label="simple table">
					<TableHead sx={{ backgroundColor: "#003366" }}>
						<TableRow sx={{ "&:hover": { backgroundColor: "transparent" } }}>
							<TableCell />
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Aeronave
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Pouso
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Decolagem
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Data solicitação
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<Loader />
						) : liveRequests.length > 0 ? (
							liveRequests.map((e) => (
								<TableRow hover key={e.id_request} sx={{ "&:hover": { backgroundColor: "transparent" } }}>
									<TableCell align="center">
										<Chip color="warning" variant="filled" size="large" label={`# ${e.id_request}`} sx={{ fontWeight: "bold", height: 30, color: "black" }} />
									</TableCell>
									<TableCell align="center" sx={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
										{e.rab}
									</TableCell>
									<TableCell align="center" sx={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
										{format(new Date(e.landing_date), "dd/MM/yyyy HH:mm")}
									</TableCell>
									<TableCell align="center" sx={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
										{e.takeoff_date ? format(new Date(e.takeoff_date), "dd/MM/yyyy HH:mm") : "N/A"}
									</TableCell>
									<TableCell align="center" sx={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
										{format(new Date(e.created_at), "dd/MM/yyyy HH:mm")}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<Typography variant="h3" sx={{ my: 10, color: "white", fontWeight: "bold" }}>
										Nenhuma solicitação em aberto
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
