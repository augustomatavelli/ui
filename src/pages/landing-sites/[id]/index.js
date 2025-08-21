import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import Loader from "components/Loader";
import dayjs from "dayjs";
import useLandingSite from "hooks/useLandingSite";
import LandingSiteContext from "contexts/LandingSiteContext";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const UserDetails = () => {
	const { findOneLandingSiteById, deleteLandingSite } = useLandingSite();

	const { loadingLandingSite, landingSiteDetails, setLoadingLandingSite } = useContext(LandingSiteContext);

	const [openAlert, setOpenAlert] = useState(false);

	const { id } = useParams();

	const { id_landing_site, name, ciad, type, operation_type, endereco, cidade, capacity, status, created_at } = landingSiteDetails;

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	useEffect(() => {
		findOneLandingSiteById(id);
	}, [id]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard title="Detalhes do helicentro">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingLandingSite ? (
								<Loader />
							) : (
								<List sx={{ py: 0 }}>
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Nome</Typography>
													<Typography>{name}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">CIAD</Typography>
													<Typography>{ciad}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Tipo</Typography>
													<Typography>{type === "H" ? "Heliporto" : type}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Tipo de operação</Typography>
													<Typography>{operation_type === "P" ? "Público" : "Privado"}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Endereço</Typography>
													<Typography>{endereco}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Cidade</Typography>
													<Typography>{cidade}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Capacidade</Typography>
													<Typography>{capacity}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Status</Typography>
													<Typography>{status === "A" ? "Ativo" : status === "P" ? "Pendente" : "Inativo"}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Criado em</Typography>
													<Typography>{dayjs.utc(created_at).format("DD/MM/YYYY HH:mm")}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
								</List>
							)}
							<Box sx={{ p: 2.5 }}>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }} spacing={2}>
									<Button
										variant="outlined"
										color="error"
										onClick={() => {
											window.history.back();
											setLoadingLandingSite({});
										}}
									>
										Voltar
									</Button>
									<Button
										variant="contained"
										color="error"
										onClick={() => {
											setOpenAlert(true);
										}}
									>
										Excluir
									</Button>
									<AlertCustomerDelete title={name} open={openAlert} handleClose={handleAlertClose} id={id_landing_site} handleDelete={deleteLandingSite} />
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</MainCard>
			</Grid>
		</>
	);
};

export default UserDetails;
