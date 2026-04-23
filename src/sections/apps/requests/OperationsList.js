import { Grid, Card, CardContent, Typography, TextField, Box, Checkbox, Switch, FormControlLabel } from "@mui/material";
import { useState } from "react";
import * as Icons from "@mui/icons-material";

export const OperationsList = ({ checked, setChecked, searchOperations, requestObject, handleChange, handleCheckboxChange }) => {
	const [fillTank, setFillTank] = useState({});

	const handleFillTankChange = (serviceId, serviceName, unit, price) => {
		setFillTank((prev) => {
			const newFillTank = { ...prev, [serviceName]: !prev[serviceName] };
			const amount = newFillTank[serviceName] ? "full" : "";
			handleChange(serviceId, serviceName, amount, unit, price);
			return newFillTank;
		});
	};

	const serviceIconColors = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

	return searchOperations.map((e, index) => {
		const IconComponent = Icons[e.icon_name];
		return (
			<Card key={e.id_service} sx={{ minWidth: 200, marginRight: "1rem" }}>
				<Box>
					<Checkbox checked={checked[e.name]} onChange={() => handleCheckboxChange(e)} onClick={(event) => event.stopPropagation()} disabled={e.actual_stock && Number(e.actual_stock) === 0} />
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
							{<IconComponent style={{ fontSize: 50, color: serviceIconColors[index] }} />}
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
											handleFillTankChange(e.id_service, e.name, e.unit, e.price);
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
									handleChange(e.id_service, e.name, newValue, e.unit, e.price);
								}}
								onClick={(e) => e.stopPropagation()}
								onFocus={(e) => e.stopPropagation()}
								inputProps={{ min: 0 }}
								size="small"
								sx={{ width: 80, mt: 1 }}
								disabled={!checked[e.name] || fillTank[e.name]}
							/>
							<Box sx={{ mt: 1, maxWidth: 150, textAlign: "left" }}>
								{e.actual_stock != null && Number(e.actual_stock) > 0 && (
									<Typography
										variant="caption"
										sx={{
											display: "block",
											width: "100%",
											whiteSpace: "normal",
											wordBreak: "break-word",
											color: "success.main",
											fontWeight: 500,
										}}
									>
										Estoque atual: {Number(e.actual_stock).toLocaleString("pt-BR")} L
									</Typography>
								)}

								{fillTank[e.name] && (
									<Typography
										variant="caption"
										sx={{
											display: "block",
											width: "100%",
											whiteSpace: "normal",
											wordBreak: "break-word",
											mt: 0.5,
										}}
									>
										*O abastecimento completo depende da disponibilidade de combustível
									</Typography>
								)}

								{e.actual_stock != null && Number(e.actual_stock) === 0 && (
									<Typography
										variant="caption"
										color="error"
										sx={{
											display: "block",
											width: "100%",
											whiteSpace: "normal",
											wordBreak: "break-word",
										}}
									>
										*No momento não temos estoque de {e.name}
									</Typography>
								)}
							</Box>
						</>
					)}
				</CardContent>
			</Card>
		);
	});
};
