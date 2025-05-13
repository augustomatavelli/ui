import { Grid, Card, CardContent, Typography, TextField, Box, Checkbox, Switch, FormControlLabel } from "@mui/material";
import { FaGasPump, FaTaxi, FaHotel } from "react-icons/fa";
import { useState } from "react";

export const OperationsList = ({ checked, setChecked, searchOperations, requestObject, handleChange, handleCheckboxChange }) => {
	const [fillTank, setFillTank] = useState({});

	const handleFillTankChange = (serviceId, serviceName, unit) => {
		setFillTank((prev) => {
			const newFillTank = { ...prev, [serviceName]: !prev[serviceName] };
			const amount = newFillTank[serviceName] ? "full" : "";
			handleChange(serviceId, serviceName, amount, unit);
			return newFillTank;
		});
	};

	return (
		<Grid>
			<Box
				sx={{
					display: "flex",
					overflowX: "auto",
					padding: "1rem",
					whiteSpace: "nowrap",
					"&::-webkit-scrollbar": {
						height: "8px",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundColor: "#888",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						backgroundColor: "#555",
					},
				}}
			>
				{searchOperations.map((e) => (
					<Card key={e.id_service} sx={{ minWidth: 200, marginRight: "1rem", position: "relative", paddingTop: "16px" }}>
						<Box sx={{ position: "absolute", top: 8, left: 8 }}>
							<Checkbox checked={checked[e.name]} onChange={() => handleCheckboxChange(e)} onClick={(event) => event.stopPropagation()} />
						</Box>
						<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<Grid
								item
								xs={12}
								md={3}
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 2,
								}}
							>
								<Box
									sx={{
										width: "100%",
										height: "50px",
										overflow: "hidden",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{e.name === "Taxi" ? (
										<FaTaxi style={{ fontSize: 50, color: "#ffc107" }} />
									) : e.name === "Hospedagem" ? (
										<FaHotel style={{ fontSize: 50, color: "#0000FF" }} />
									) : (
										<FaGasPump style={{ fontSize: 50, color: "#FF0000" }} />
									)}
								</Box>
								<Typography variant="subtitle1">{e.name}</Typography>
							</Grid>
							{e.unit === "L" && (
								<>
									<FormControlLabel
										sx={{ m: 0 }}
										control={
											<Switch
												checked={fillTank[e.name] || false}
												onChange={(event) => {
													event.stopPropagation();
													handleFillTankChange(e.id_service, e.name, e.unit);
												}}
												onClick={(event) => {
													event.stopPropagation();
												}}
												onFocus={(event) => {
													event.stopPropagation();
												}}
												disabled={!checked[e.name]}
											/>
										}
										label="Full"
									/>
									<TextField
										type="number"
										value={requestObject.services && requestObject.services.length > 0 ? (requestObject.services.find((p) => p.id_service === e.id_service)?.amount ?? "") : ""}
										onChange={(el) => {
											const rawValue = el.target.value;
											const newValue = rawValue === "" ? "" : Math.max(0, Number(rawValue));
											handleChange(e.id_service, e.name, newValue, e.unit);
										}}
										onClick={(e) => e.stopPropagation()}
										onFocus={(e) => e.stopPropagation()}
										inputProps={{ min: 0 }}
										size="small"
										sx={{ width: 80, mt: 1 }}
										disabled={!checked[e.name] || fillTank[e.name]}
									/>
								</>
							)}
						</CardContent>
					</Card>
				))}
			</Box>
		</Grid>
	);
};
