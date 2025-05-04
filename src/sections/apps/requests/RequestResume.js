import { useState } from "react";
import { TableContainer, Table, TableBody, TableRow, TableCell, Typography, Button, Collapse, Box, Grid, List, ListItem } from "@mui/material";
import RequestContext from "contexts/RequestContext";
import { useContext, useEffect } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const RequestResume = ({}) => {
	const { requestResume } = useContext(RequestContext);

	const [openOperations, setOpenOperations] = useState(false);
	const [openProducts, setOpenProducts] = useState(false);

	useEffect(() => {}, []);

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
					<TableRow>
						<TableCell sx={{ opacity: 0.5 }}>Data agendada para pouso</TableCell>
						<TableCell align="right" sx={{ opacity: 0.5 }}>
							{dayjs(requestResume.landing_date).format("DD/MM/YYYY HH:mm")}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ opacity: 0.5 }}>Número de passageiros</TableCell>
						<TableCell align="right" sx={{ opacity: 0.5 }}>
							<Typography>{requestResume.amount}</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ opacity: 0.5 }}>Data agendada para decolagem</TableCell>
						<TableCell align="right" sx={{ opacity: 0.5 }}>
							{requestResume.takeoff_date ? dayjs(requestResume.takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}
						</TableCell>
					</TableRow>
					{requestResume.services && requestResume.services.length > 0 && (
						<>
							<TableRow onClick={() => setOpenOperations(!openOperations)} sx={{ cursor: "pointer" }}>
								<TableCell sx={{ borderBottom: openOperations && "none", opacity: 0.5 }}>Serviços</TableCell>
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
													{requestResume.services.map((e) => (
														<ListItem key={e.id_operation}>{e.unit === "un" ? `${e.name}` : e.amount === "full" ? "Full" : `${e.name} ${e.amount}${e.unit}`}</ListItem>
													))}
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
								<TableCell sx={{ borderBottom: openProducts && "none", opacity: 0.5 }}>Produtos</TableCell>
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
				</TableBody>
			</Table>
		</TableContainer>
	);
};
