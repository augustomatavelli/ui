// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import Loader from "components/Loader";
import dayjs from "dayjs";
import useLandingSite from "hooks/useLandingSite";
import LandingSiteContext from "contexts/LandingSiteContext";

const UserDetails = () => {
	const { findOneLandingSiteById } = useLandingSite();

	const { loadingLandingSite, landingSiteDetails, setLoadingLandingSite } = useContext(LandingSiteContext);

	const { id } = useParams();

	const { name, ciad, type, endereco, cidade, capacity, status, created_at } = landingSiteDetails;

	useEffect(() => {
		findOneLandingSiteById(id);
	}, [id]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard title="Detalhes do aeródromo">
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
													<Typography> {dayjs(created_at).format("DD/MM/YYYY HH:mm")}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
								</List>
							)}
							<Box sx={{ p: 2.5 }}>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }}>
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
