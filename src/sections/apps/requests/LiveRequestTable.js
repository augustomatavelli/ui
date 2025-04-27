import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Grid } from "@mui/material";
import { Howl } from "howler";

import { useContext, useEffect, useRef } from "react";
import useRequest from "hooks/useRequest";
import RequestContext from "contexts/RequestContext";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import Loader from "components/Loader";

export default function RequestsTable() {
	const { findAllLiveRequests } = useRequest();

	const { liveRequests, loadingRequest } = useContext(RequestContext);

	const previousIds = useRef(new Set());

	const alertSound = new Howl({
		src: ["/sounds/mixkit-home-standard-ding-dong-109.wav"],
		volume: 1,
	});

	useEffect(() => {
		findAllLiveRequests();

		const intervalId = setInterval(() => {
			findAllLiveRequests();
		}, 60000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (liveRequests?.items) {
			const currentIds = new Set(liveRequests.items.map((item) => item.id_request));
			const newItems = Array.from(currentIds).filter((id) => !previousIds.current.has(id));
			if (newItems.length > 0) {
				alertSound.play();
			}

			previousIds.current = currentIds;
		}
	}, [liveRequests]);

	const isSoon = (date) => {
		const eventDate = new Date(date);
		const now = new Date();
		const diffInMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
		return diffInMinutes > 0 && diffInMinutes <= 5;
	};

	const pulseAnimation = {
		"@keyframes pulse": {
			"0%": { backgroundColor: "#ffcc00" },
			"50%": { backgroundColor: "#fff176" },
			"100%": { backgroundColor: "#ffcc00" },
		},
		animation: "pulse 5s infinite",
	};

	let globalIndex = 0;

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
								Modelo
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Piloto
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Hora
							</TableCell>
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }} />
							<TableCell align="center" sx={{ color: "white", fontSize: 20 }}>
								Observações
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loadingRequest ? (
							<Loader />
						) : liveRequests && liveRequests.items && liveRequests.items.length > 0 ? (
							liveRequests.items.flatMap((e) =>
								e.schedules.map((schedule, index) => {
									const currentIndex = globalIndex++;
									return (
										<TableRow
											key={`${e.id_request}-${schedule.type}`}
											sx={{
												...(isSoon(schedule.date) ? pulseAnimation : {}),
												backgroundColor: currentIndex % 2 === 0 ? "#424242" : "#9e9e9e",
												color: index % 2 === 0 ? "white" : "black",
											}}
										>
											<TableCell align="center">{<Chip color="warning" variant="filled" size="large" label={`# ${e.id_request}`} sx={{ fontWeight: "bold", height: 30, color: "black" }} />}</TableCell>
											<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18, fontWeight: "bold" }}>
												{e.registration}
											</TableCell>
											<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18, fontWeight: "bold" }}>
												{e.model}
											</TableCell>
											<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18, fontWeight: "bold" }}>
												{e.user}
											</TableCell>
											<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18 }}>
												{new Date(schedule.date).toLocaleString("pt-BR")}
											</TableCell>
											<TableCell align="center" sx={{ color: isSoon(schedule.date) ? "black	" : "white", fontSize: 18 }}>
												{schedule.type === "landing_date" ? (
													<Grid>
														<Typography variant="h4" a sx={{ gap: 2, alignItems: "center", justifyContent: "center", display: "flex" }}>
															<FlightLandIcon sx={{ fontSize: 30 }} /> Pouso
														</Typography>
													</Grid>
												) : (
													<Typography variant="h4" a sx={{ gap: 2, alignItems: "center", justifyContent: "center", display: "flex" }}>
														Decolagem
														<FlightTakeoffIcon sx={{ fontSize: 30 }} />
													</Typography>
												)}
											</TableCell>
											<TableCell align="center">
												{
													<Chip
														color={schedule.isLate === 1 ? "error" : "success"}
														variant="filled"
														size="large"
														label={schedule.isLate === 1 ? "Atrasado" : "Previsto"}
														sx={{ fontWeight: "bold", height: 30 }}
													/>
												}
											</TableCell>
										</TableRow>
									);
								})
							)
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
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
