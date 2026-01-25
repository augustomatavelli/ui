import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Collapse, OutlinedInput, IconButton } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import UserContext from "contexts/UserContext";
import useUser from "hooks/useUser";
import Loader from "components/Loader";
import { UpOutlined, DownOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { UserAircraftsList } from "sections/apps/users/UserAircraftsList";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { ErrorMessages } from "utils/errors-messages/errors-messages";

dayjs.extend(utc);

const UserDetails = () => {
	const { findOneUserById, deleteUser, updateUser } = useUser();

	const { loadingUser, userDetails, setUserDetails } = useContext(UserContext);

	const [openUserAircrafts, setOpenUserAircrafts] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [editName, setEditName] = useState(false);
	const [editNameValue, setEditNameValue] = useState("");
	const [editEmail, setEditEmail] = useState(false);
	const [editEmailValue, setEditEmailValue] = useState("");
	const [editMobile, setEditMobile] = useState(false);
	const [editMobileValue, setEditMobileValue] = useState("");

	const { id } = useParams();

	const { name, email, login, mobile, type, license, status, created_at } = userDetails;

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	const handleSave = async () => {
		if ((editName && !editNameValue) || (editEmail && !editEmailValue) || (editMobile && !editMobileValue)) {
			dispatch(
				openSnackbar({
					open: true,
					message: "Preencha os campos antes de salvar",
					variant: "alert",
					alert: { color: "error" },
					close: false,
				}),
			);
			return;
		}
		try {
			const response = await updateUser(id, {
				name: editNameValue ? editNameValue : name,
				email: editEmailValue ? editEmailValue : email,
				mobile: editMobileValue ? editMobileValue : mobile,
			});
			dispatch(
				openSnackbar({
					open: true,
					message: response.message,
					variant: "alert",
					alert: { color: "success" },
					close: false,
				}),
			);
			setEditName(false);
			setEditEmail(false);
			setEditMobile(false);
			await findOneUserById(id);
		} catch (error) {
			dispatch(
				openSnackbar({
					open: true,
					message: "Erro ao salvar alterações",
					variant: "alert",
					alert: { color: "error" },
					close: false,
				}),
			);
		}
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
													{!editName ? (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<Typography>{name}</Typography>
															<IconButton
																size="small"
																onClick={() => {
																	setEditName(true);
																	setEditNameValue(name);
																}}
															>
																<EditOutlined />
															</IconButton>
														</Box>
													) : (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<OutlinedInput
																id="name"
																type="text"
																value={editNameValue}
																name="name"
																sx={{ height: "30px" }}
																inputProps={{
																	style: { padding: 5, width: "fit-content" },
																}}
																onChange={(e) => {
																	setEditNameValue(e.target.value);
																}}
															/>
														</Box>
													)}
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
													{!editEmail ? (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<Typography>{email}</Typography>
															<IconButton
																size="small"
																onClick={() => {
																	setEditEmail(true);
																	setEditEmailValue(email);
																}}
															>
																<EditOutlined />
															</IconButton>
														</Box>
													) : (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<OutlinedInput
																id="email"
																type="email"
																value={editEmailValue}
																name="email"
																sx={{ height: "30px" }}
																inputProps={{
																	style: { padding: 5, width: "fit-content" },
																}}
																onChange={(e) => {
																	setEditEmailValue(e.target.value);
																}}
															/>
														</Box>
													)}
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Login</Typography>
													<Typography>{login ? login : "-"}</Typography>
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
													{!editMobile ? (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<Typography>{mobile}</Typography>
															<IconButton
																size="small"
																onClick={() => {
																	setEditMobile(true);
																	setEditMobileValue(mobile);
																}}
															>
																<EditOutlined />
															</IconButton>
														</Box>
													) : (
														<Box display="inline-flex" alignItems="center" gap={1}>
															<InputMask
																mask={"(99) 99999-9999"}
																value={editMobileValue}
																onChange={(e) => {
																	setEditMobileValue(e.target.value);
																}}
															>
																{() => <OutlinedInput fullWidth id="phone-signup" name="phone" />}
															</InputMask>
														</Box>
													)}
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
													<Typography color="secondary">Número ANAC</Typography>
													{license ? <Typography>{license}</Typography> : <Typography>Usuário não possui número ANAC</Typography>}
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
													<Typography>{created_at}</Typography>
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
									<Button variant="contained" onClick={handleSave}>
										Salvar
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
