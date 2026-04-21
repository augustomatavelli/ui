import { useState } from "react";
import { TableContainer, Table, TableBody, TableRow, TableCell, Typography, Button, Collapse, Box, Grid, List, ListItem } from "@mui/material";
import RequestContext from "contexts/RequestContext";
import { useContext } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const formatBRL = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const RequestResume = ({ aircraft }) => {
	const { requestResume } = useContext(RequestContext);

	const [openOperations, setOpenOperations] = useState(false);
	const [openProducts, setOpenProducts] = useState(false);

	const parseNumber = (value) => {
		if (typeof value === "number") return value;
		if (typeof value !== "string") return 0;

		const trimmedValue = value.trim();
		if (!trimmedValue) return 0;

		const normalizedValue = trimmedValue.includes(",") ? trimmedValue.replace(/\./g, "").replace(",", ".") : trimmedValue;
		const parsedValue = Number(normalizedValue);

		return Number.isFinite(parsedValue) ? parsedValue : 0;
	};

	const productsTotal = (requestResume.products || []).reduce((total, product) => {
		const price = parseNumber(product.price);
		const itemAmount = parseNumber(product.amount);

		return total + price * itemAmount;
	}, 0);

	const { membership } = aircraft;
	const { amount } = requestResume;

	const landingDate = requestResume.landing_date ? dayjs(requestResume.landing_date) : null;
	const takeoffDate = requestResume.takeoff_date ? dayjs(requestResume.takeoff_date) : null;

	const hasBothDates = Boolean(landingDate && takeoffDate);

	let nights = 0;
	if (hasBothDates) {
		const earlierDate = membership === "S" ? takeoffDate : landingDate;
		const laterDate = membership === "S" ? landingDate : takeoffDate;
		nights = laterDate.startOf("day").diff(earlierDate.startOf("day"), "day");
	}

	const fuelService = (requestResume.services || []).find((s) => s.id_service === 1);
	const hasFuel = Boolean(fuelService);
	const fuelIsFull = hasFuel && fuelService.amount === "full";

	let stayFee = null;
	if (hasBothDates && membership !== "S") {
		if (nights > 0) {
			stayFee = 350 * nights;
		} else {
			stayFee = hasFuel ? 250 : 350;
		}
	}

	let fuelCost = null;
	if (hasFuel && !fuelIsFull) {
		const fuelPrice = parseNumber(fuelService.price);
		const fuelAmount = parseNumber(fuelService.amount);
		fuelCost = fuelPrice * fuelAmount;
	}

	const servicesTotal = (requestResume.services || []).reduce((total, service) => {
		if (service.amount === "full") return total;
		const price = parseNumber(service.price);
		const amt = parseNumber(service.amount);
		return total + price * amt;
	}, 0);

	const servicesCaptionText = fuelIsFull && servicesTotal === 0 ? "a confirmar" : fuelIsFull ? `${formatBRL(servicesTotal)} + combustível` : formatBRL(servicesTotal);

	const grandTotal = productsTotal + (stayFee ?? 0) + (fuelCost ?? 0);

	return (
		<TableContainer>
			<Table sx={{ minWidth: "auto" }} size="small" aria-label="simple table">
				<TableBody>
					<TableRow>
						<TableCell sx={{ opacity: 0.5 }}>Helicentro</TableCell>
						<TableCell align="right" sx={{ opacity: 0.5 }}>
							{requestResume.name_landing_site}
						</TableCell>
					</TableRow>
					{membership === "S" ? (
						<>
							<TableRow>
								<TableCell sx={{ opacity: 0.5 }}>Data agendada para decolagem</TableCell>
								<TableCell align="right" sx={{ opacity: 0.5 }}>
									{dayjs(requestResume.takeoff_date).format("DD/MM/YYYY HH:mm")}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ opacity: 0.5 }}>Data agendada para pouso</TableCell>
								<TableCell align="right" sx={{ opacity: 0.5 }}>
									{requestResume.landing_date ? dayjs(requestResume.landing_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}
								</TableCell>
							</TableRow>
						</>
					) : (
						<>
							<TableRow>
								<TableCell sx={{ opacity: 0.5 }}>Data agendada para pouso</TableCell>
								<TableCell align="right" sx={{ opacity: 0.5 }}>
									{dayjs(requestResume.landing_date).format("DD/MM/YYYY HH:mm")}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell sx={{ opacity: 0.5 }}>Data agendada para decolagem</TableCell>
								<TableCell align="right" sx={{ opacity: 0.5 }}>
									{requestResume.takeoff_date ? dayjs(requestResume.takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}
								</TableCell>
							</TableRow>
						</>
					)}

					<TableRow>
						<TableCell sx={{ opacity: 0.5 }}>Número de passageiros</TableCell>
						<TableCell align="right" sx={{ opacity: 0.5 }}>
							<Typography>{amount ? amount : "Não informado"}</Typography>
						</TableCell>
					</TableRow>

					{requestResume.services && requestResume.services.length > 0 && (
						<>
							<TableRow onClick={() => setOpenOperations(!openOperations)} sx={{ cursor: "pointer" }}>
								<TableCell sx={{ borderBottom: openOperations && "none", opacity: 0.5 }}>
									<Box>
										<Typography variant="body1">Serviços</Typography>
										<Typography variant="caption" color="text.secondary">
											{servicesCaptionText}
										</Typography>
									</Box>
								</TableCell>
								<TableCell align="right" sx={{ borderBottom: openOperations && "none", opacity: 0.5 }}>
									<Button type="secondary" onClick={() => setOpenOperations(!openOperations)} color="secondary">
										{openOperations ? <UpOutlined /> : <DownOutlined />}
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={2} sx={{ padding: 0, borderBottom: "none" }}>
									<Collapse in={openOperations}>
										<Box sx={{ padding: 0 }}>
											<Table>
												<List sx={{ padding: 0, opacity: 0.5 }}>
													{requestResume.services.map((e) => {
														let leftText;
														let rightText;
														if (e.amount === "full") {
															leftText = `${e.name} (Full)`;
															rightText = "a confirmar";
														} else {
															const itemCost = parseNumber(e.price) * parseNumber(e.amount);
															leftText = e.unit === "un" ? e.name : `${e.name} ${e.amount}${e.unit}`;
															rightText = itemCost > 0 ? formatBRL(itemCost) : "";
														}
														return (
															<ListItem key={e.id_service} sx={{ display: "flex", justifyContent: "space-between" }}>
																<span>{leftText}</span>
																{rightText && <span>{rightText}</span>}
															</ListItem>
														);
													})}
												</List>
											</Table>
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
						</>
					)}
					{requestResume.products && requestResume.products.length > 0 && (
						<>
							<TableRow onClick={() => setOpenProducts(!openProducts)} sx={{ cursor: "pointer" }}>
								<TableCell sx={{ borderBottom: openProducts && "none", opacity: 0.5 }}>
									<Box>
										<Typography variant="body1">Produtos</Typography>
										<Typography variant="caption" color="text.secondary">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(productsTotal)}
										</Typography>
									</Box>
								</TableCell>
								<TableCell align="right" sx={{ borderBottom: openProducts && "none", opacity: 0.5 }}>
									<Button type="secondary" onClick={() => setOpenProducts(!openProducts)} color="secondary">
										{openProducts ? <UpOutlined /> : <DownOutlined />}
									</Button>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={2} sx={{ padding: 0, borderBottom: "none" }}>
									<Collapse in={openProducts}>
										<Box sx={{ padding: 0 }}>
											<Table>
												<List sx={{ padding: 0, opacity: 0.5 }}>
													{requestResume.products.map((e) => (
														<ListItem key={e.id_product}>{`${e.amount}x ${e.name}`}</ListItem>
													))}
												</List>
											</Table>
										</Box>
									</Collapse>
								</TableCell>
							</TableRow>
						</>
					)}
					{hasBothDates && membership !== "S" && (
						<TableRow>
							<TableCell sx={{ opacity: 0.5 }}>
								Estadia
								{nights > 0 && (
									<Typography variant="caption" color="text.secondary" display="block">
										{nights} {nights === 1 ? "noite" : "noites"}
									</Typography>
								)}
							</TableCell>
							<TableCell align="right" sx={{ opacity: 0.5 }}>
								{formatBRL(stayFee)}
							</TableCell>
						</TableRow>
					)}

					{(stayFee !== null || productsTotal > 0 || fuelCost !== null) && (
						<TableRow>
							<TableCell>
								<Typography variant="subtitle1" fontWeight="bold">
									Total
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="subtitle1" fontWeight="bold">
									{fuelIsFull ? `${formatBRL(grandTotal)} + combustível` : formatBRL(grandTotal)}
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
