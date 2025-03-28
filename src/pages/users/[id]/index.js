// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import Loader from "components/Loader";
import dayjs from "dayjs";

const UserDetails = () => {
	const { findOneUserById } = useUser();

	const { loadingUser, userDetails, setUserDetails } = useContext(UserContext);

	const { id } = useParams();

	const { name, email, mobile, type, pilot_register, status, created_at } = userDetails;

	useEffect(() => {
		findOneUserById(id);
	}, [id]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard title="Detalhes do usuário">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingUser ? (
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
													<Typography color="secondary">Email</Typography>
													<Typography>{email}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Celular</Typography>
													<Typography>{mobile}</Typography>
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
													<Typography>{type === "A" ? "Administrador" : type === "P" ? "Piloto" : type === "R" ? "Responsável" : "Comum"}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Registro do piloto</Typography>
													<Typography>{pilot_register}</Typography>
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
											setUserDetails({});
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
