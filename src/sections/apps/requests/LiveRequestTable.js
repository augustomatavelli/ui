import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from "@mui/material";

import { useContext, useEffect } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
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

	const isSoon = (date) => {
		const eventDate = new Date(date);
		const now = new Date();
		const diffInMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
		return diffInMinutes > 0 && diffInMinutes <= 30;
	};

	const pulseAnimation = {
		"@keyframes pulse": {
			"0%": { backgroundColor: "#ffcc00" },
			"50%": { backgroundColor: "#fff176" },
			"100%": { backgroundColor: "#ffcc00" },
		},
		animation: "pulse 5s infinite",
	};

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
								Piloto
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Horário Previsto
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<Loader />
						) : liveRequests.length > 0 ? (
							liveRequests.flatMap((e) =>
								e.schedules.map((schedule) => (
									<TableRow
										key={`${e.id_request}-${schedule.type}`}
										sx={{
											...(isSoon(schedule.date) ? pulseAnimation : {}),
											"&:hover": { backgroundColor: "transparent" },
										}}
									>
										<TableCell align="center">{<Chip color="warning" variant="filled" size="large" label={`# ${e.id_request}`} sx={{ fontWeight: "bold", height: 30, color: "black" }} />}</TableCell>
										<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18, fontWeight: "bold" }}>
											{e.registration}
										</TableCell>
										<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18, fontWeight: "bold" }}>
											{e.user}
										</TableCell>
										<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18 }}>
											{new Date(schedule.date).toLocaleString("pt-BR")}
										</TableCell>
										<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18 }}>
											{schedule.type === "landing_date" ? (
												<Typography variant="h4" a sx={{ gap: 2, alignItems: "center", justifyContent: "center", display: "flex" }}>
													<FlightLandIcon sx={{ fontSize: 30 }} /> Pouso
												</Typography>
											) : (
												<Typography variant="h4" a sx={{ gap: 2, alignItems: "center", justifyContent: "center", display: "flex" }}>
													Decolagem
													<FlightTakeoffIcon sx={{ fontSize: 30 }} />
												</Typography>
											)}
										</TableCell>
									</TableRow>
								))
							)
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
