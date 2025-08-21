// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Collapse } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import Loader from "components/Loader";
import dayjs from "dayjs";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { UserAircraftsList } from "sections/apps/users/UserAircraftsList";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";

const UserDetails = () => {
	const { findOneUserById, deleteUser } = useUser();

	const { loadingUser, userDetails, setUserDetails } = useContext(UserContext);

	const [openUserAircrafts, setOpenUserAircrafts] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);

	const { id } = useParams();

	const { name, email, mobile, type, license, status, created_at } = userDetails;

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

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
													<Typography>{type === "A" ? "Administrador" : type === "P" ? "Piloto" : type === "O" ? "Operador" : "Comum"}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Licença</Typography>
													{license ? <Typography>{license}</Typography> : <Typography>Usuário não possui licença de piloto</Typography>}
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
									<ListItem onClick={() => setOpenUserAircrafts(!openUserAircrafts)} sx={{ cursor: "pointer" }}>
										<Grid container spacing={3}>
											<Grid item xs={6}>
												<Typography color="secondary">Aeronaves</Typography>
											</Grid>
											<>
												<Grid item xs={6} display="flex" justifyContent="flex-end">
													<Button type="secondary" color="secondary">
														{openUserAircrafts ? <UpOutlined /> : <DownOutlined />}
													</Button>
												</Grid>
												<Grid item xs={12}>
													<Collapse in={openUserAircrafts}>
														<Box sx={{ padding: 0 }}>
															<Grid>
																<Box
																	sx={{
																		display: "flex",
																		overflowX: "auto",
																		padding: "0.5rem",
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
																	{userDetails.aircrafts && userDetails.aircrafts.length > 0 ? (
																		<UserAircraftsList data={userDetails.aircrafts} />
																	) : (
																		<Grid sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
																			<Typography variant="subtitle1">Usuário não possui nenhuma aeronave vinculada</Typography>
																		</Grid>
																	)}
																</Box>
															</Grid>
														</Box>
													</Collapse>
												</Grid>
											</>
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
											setUserDetails({});
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
									<AlertCustomerDelete title={name} open={openAlert} handleClose={handleAlertClose} id={Number(id)} handleDelete={deleteUser} />
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
