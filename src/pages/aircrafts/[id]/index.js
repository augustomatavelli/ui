import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Dialog, Checkbox, Chip, IconButton, FormLabel, Avatar, TextField, useTheme } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import AircraftContext from "contexts/AircraftContext";
import useAircraft from "hooks/useAircraft";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { PopupTransition } from "components/@extended/Transitions";
import AddLinkUserAircraft from "sections/apps/aircrafts/AddLinkUserAircraft";
import ConfirmRemoveLinkUserAircraft from "sections/apps/aircrafts/ConfirmRemoveLinkUserAircraft";
import UserContext from "contexts/UserContext";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";
import AddIcon from "@mui/icons-material/Add";
import AddLinkOperatorAircraft from "sections/apps/aircrafts/AddLinkOperatorAircraft";
import { CameraOutlined } from "@ant-design/icons";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";

const AircraftDetails = () => {
	const { findOneAircraftById, removeLinkUserAircraft, deleteAircraft, toggleRestrictedAircraft, removeLinkOperatorAircraft, updateAircraftImage } = useAircraft();

	const { aircraftDetails, setAircraftDetails } = useContext(AircraftContext);
	const { setSearchUser, user } = useContext(UserContext);

	const [open, setOpen] = useState(false);
	const [openOperator, setOpenOperator] = useState(false);
	const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [checked, setChecked] = useState(false);
	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();

	const { id } = useParams();

	const theme = useTheme();

	const { id_aircraft, registration, image, membership, status, is_restricted, operators, modelo } = aircraftDetails;

	const userId = localStorage.getItem("_userId");

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	const handleremoveLinkUserAircraft = async () => {
		const response = await removeLinkUserAircraft(userId, id_aircraft);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			}),
		);
		window.history.back();
	};

	const handleToggleChecked = async (event) => {
		setChecked(event.target.checked);
		const response = await toggleRestrictedAircraft(id_aircraft, event.target.checked ? "S" : "N");
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			}),
		);
	};

	const handleDeleteOperatorAircraft = async (operatorId, aircraftId) => {
		const response = await removeLinkOperatorAircraft(operatorId, aircraftId);
		dispatch(
			openSnackbar({
				open: true,
				message: response.message,
				variant: "alert",
				alert: {
					color: "success",
				},
				close: false,
			}),
		);
		await findOneAircraftById(aircraftId);
	};

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	useEffect(() => {
		findOneAircraftById(id);
	}, [id]);

	useEffect(() => {
		is_restricted === "S" ? setChecked(true) : setChecked(false);
	}, [is_restricted]);

	useEffect(() => {
		const updateAircraftImageImage = async () => {
			if (selectedImage) {
				setAvatar(URL.createObjectURL(selectedImage));

				let base64Image = "";
				base64Image = await readFile(selectedImage);

				const aircraftBody = {
					image: selectedImage ? base64Image : "",
				};

				await updateAircraftImage(id_aircraft, aircraftBody);
				await findOneAircraftById(id_aircraft);
			}
		};

		updateAircraftImageImage();
	}, [selectedImage, id_aircraft]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard
					title="Detalhes da aeronave"
					secondary={
						(user.type === "A" || user.type === "S") && (
							<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Checkbox style={{ padding: 0 }} checked={checked} onChange={handleToggleChecked} />
								<Typography>Tornar aeronave restrita</Typography>
							</Grid>
						)
					}
				>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={4} md={3}>
							{image || selectedImage ? (
								<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
									{user.type === "A" || user.type === "S" ? (
										<FormLabel
											htmlFor="change-aircraft-image"
											sx={{
												cursor: "pointer",
												display: "block",
												width: "100%",
												position: "relative",
											}}
										>
											<img
												src={image ? image : selectedImage ? URL.createObjectURL(selectedImage) : ""}
												alt="Aircraft"
												style={{
													width: "100%",
													height: "200px",
													objectFit: "cover",
													cursor: "pointer",
												}}
											/>
											<Box
												sx={{
													position: "absolute",
													top: "8px",
													right: "8px",
													backgroundColor: "rgba(0, 0, 0, 0.7)",
													borderRadius: "50%",
													padding: "8px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
												}}
											>
												<CameraAltIcon sx={{ color: "white", fontSize: "1rem" }} />
											</Box>
										</FormLabel>
									) : (
										<img
											src={image ? image : selectedImage ? URL.createObjectURL(selectedImage) : ""}
											alt="Aircraft"
											style={{
												width: "100%",
												height: "200px",
												objectFit: "cover",
											}}
										/>
									)}
									{(user.type === "A" || user.type === "S") && (
										<TextField
											type="file"
											id="change-aircraft-image"
											placeholder="Outlined"
											variant="outlined"
											sx={{ display: "none" }}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													const validFormats = ["image/png", "image/jpeg"];
													const maxSize = 2 * 1024 * 1024; // 2MB

													if (!validFormats.includes(file.type)) {
														dispatch(
															openSnackbar({
																open: true,
																message: "Formato inválido! Apenas PNG e JPEG são permitidos",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															}),
														);
														return;
													}
													if (file.size > maxSize) {
														dispatch(
															openSnackbar({
																open: true,
																message: "O tamanho máximo permitido é 2MB",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															}),
														);
														return;
													}

													setSelectedImage(file);
												}
											}}
										/>
									)}
								</Box>
							) : user.type === "A" || user.type === "S" ? (
								<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 3 }}>
									<FormLabel
										htmlFor="change-avtar"
										sx={{
											position: "relative",
											borderRadius: "50%",
											overflow: "hidden",
											"&:hover .MuiBox-root": { opacity: 1 },
											cursor: "pointer",
										}}
									>
										<Avatar alt="Avatar 1" src={avatar} sx={{ width: 144, height: 144, border: "1px dashed" }}>
											{!avatar && (
												<Stack spacing={0.5} alignItems="center">
													<CameraOutlined style={{ color: theme.palette.secondary.light, fontSize: "2rem" }} />
													<Typography sx={{ color: "secondary.lighter" }}>Carregar foto</Typography>
												</Stack>
											)}
										</Avatar>
										<Box
											sx={{
												position: "absolute",
												top: 0,
												left: 0,
												backgroundColor: "rgba(0,0,0,.25)",
												width: "100%",
												height: "100%",
												opacity: 0,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										/>
									</FormLabel>
									<TextField
										type="file"
										id="change-avtar"
										placeholder="Outlined"
										variant="outlined"
										sx={{ display: "none" }}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												const validFormats = ["image/png", "image/jpeg"];
												const maxSize = 2 * 1024 * 1024; // 2MB

												if (!validFormats.includes(file.type)) {
													dispatch(
														openSnackbar({
															open: true,
															message: "Formato inválido! Apenas PNG e JPEG são permitidos",
															variant: "alert",
															alert: {
																color: "warning",
															},
															close: false,
														}),
													);
													return;
												}

												if (file.size > maxSize) {
													dispatch(
														openSnackbar({
															open: true,
															message: "O tamanho máximo permitido é 2MB",
															variant: "alert",
															alert: {
																color: "warning",
															},
															close: false,
														}),
													);
													return;
												}

												setSelectedImage(file);
											}
										}}
									/>
								</Box>
							) : (
								<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", mt: 3 }}>
									<Avatar alt="aircraft" sx={{ width: 144, height: 144, justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
										<AirplanemodeActiveIcon style={{ fontSize: 100 }} />
									</Avatar>
								</Box>
							)}
						</Grid>
						<Grid item xs={12} sm={8} md={9}>
							<List sx={{ py: 0 }}>
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Matrícula</Typography>
												<Typography>{registration}</Typography>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Modelo</Typography>
												<Typography>{modelo}</Typography>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Situação</Typography>
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
												<Typography color="secondary">Mensalista</Typography>
												<Typography>{membership === "S" ? "Sim" : "Não"}</Typography>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={1}>
												<Grid container alignItems="center" spacing={2}>
													<Grid item>
														<Typography color="secondary">Operadores</Typography>
													</Grid>
													{(user.type == "S" || user.type == "A") && (
														<Grid item>
															<Button
																variant="outlined"
																color="primary"
																startIcon={<AddIcon />}
																onClick={() => {
																	setOpenOperator(true);
																}}
																size="small"
															>
																Adicionar
															</Button>
														</Grid>
													)}
												</Grid>
												{!operators || operators.length === 0 ? (
													<Typography>Nenhum operador vinculado à aeronave.</Typography>
												) : (
													<Stack direction="row" spacing={1}>
														{operators.map((operator) => {
															return user.type === "S" || user.type === "A" ? (
																<Chip
																	key={operator.id_operator}
																	label={operator.name}
																	sx={{ width: "fit-content" }}
																	onDelete={async () => {
																		await handleDeleteOperatorAircraft(operator.id_operator, id);
																	}}
																/>
															) : (
																<Chip key={operator.id_operator} label={operator.name} sx={{ width: "fit-content" }} />
															);
														})}
													</Stack>
												)}
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
							</List>
							<Box sx={{ p: 2.5 }}>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }} spacing={2}>
									<Button
										variant="outlined"
										color="error"
										onClick={() => {
											window.history.back();
											setAircraftDetails({});
										}}
									>
										Voltar
									</Button>
									{(user.type === "A" || user.type === "S") /* && users && !users.some((item) => item.id_user === Number(userId)) */ && (
										<Button
											variant="contained"
											color="error"
											onClick={() => {
												setOpenAlert(true);
											}}
										>
											Excluir
										</Button>
									)}
									<AlertCustomerDelete title={registration} open={openAlert} handleClose={handleAlertClose} id={id_aircraft} handleDelete={deleteAircraft} />
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</MainCard>
			</Grid>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpen(false);
				}}
				open={open}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<AddLinkUserAircraft setOpen={setOpen} />
			</Dialog>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpen(false);
				}}
				open={openConfirmRemove}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<ConfirmRemoveLinkUserAircraft setOpenConfirmRemove={setOpenConfirmRemove} />
			</Dialog>
			<Dialog
				maxWidth="sm"
				fullWidth
				TransitionComponent={PopupTransition}
				onClose={() => {
					setOpenOperator(false);
				}}
				open={openOperator}
				sx={{ "& .MuiDialog-paper": { p: 0 } }}
			>
				<AddLinkOperatorAircraft setOpen={setOpenOperator} />
			</Dialog>
		</>
	);
};

export default AircraftDetails;
