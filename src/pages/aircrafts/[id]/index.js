// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Dialog, Checkbox, Chip, IconButton } from "@mui/material";

// project import
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

const AircraftDetails = () => {
	const { findOneAircraftById, removeLinkUserAircraft, deleteAircraft, toggleRestrictedAircraft, removeLinkOperatorAircraft } = useAircraft();

	const { aircraftDetails, setAircraftDetails } = useContext(AircraftContext);
	const { setSearchUser, user } = useContext(UserContext);

	const [open, setOpen] = useState(false);
	const [openOperator, setOpenOperator] = useState(false);
	const [openConfirmRemove, setOpenConfirmRemove] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [checked, setChecked] = useState(false);

	const { id } = useParams();

	const { id_aircraft, registration, category, image, membership, status, is_restricted, operators, modelo } = aircraftDetails;

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
			})
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
			})
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
			})
		);
		await findOneAircraftById(aircraftId);
	};

	useEffect(() => {
		findOneAircraftById(id);
	}, [id]);

	useEffect(() => {
		is_restricted === "S" ? setChecked(true) : setChecked(false);
	}, [is_restricted]);

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
							<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
								<img
									src={`data:image/jpeg;base64,${image}`}
									alt="Aircraft"
									style={{
										width: "100%",
										height: "200px",
										objectFit: "contain",
									}}
								/>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
									<Button
										variant="contained"
										color="warning"
										onClick={() => {
											if (user.type !== "A" && user.type !== "S" /* && users && !users.some((item) => item.id_user === Number(userId)) */) {
												handleremoveLinkUserAircraft();
											} else {
												setOpenConfirmRemove(true);
												setSearchUser([]);
											}
										}}
										sx={{ color: "black" }}
									>
										Desvincular
									</Button>
									{(user.type === "A" || user.type === "S") /* && users && !users.some((item) => item.id_user === Number(userId)) */ && (
										<Button
											variant="contained"
											color="primary"
											onClick={() => {
												setOpen(true);
												setSearchUser([]);
											}}
										>
											Vincular
										</Button>
									)}
								</Stack>
							</Box>
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
												<Typography color="secondary">Categoria</Typography>
												<Typography>{category}</Typography>
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
													<Stack direction="row" spacing={1} flexWrap="wrap">
														{operators.map((operator) => (
															<Chip
																key={operator.id_operator}
																label={operator.name}
																sx={{ width: "fit-content" }}
																onDelete={async () => {
																	await handleDeleteOperatorAircraft(operator.id_operator, id);
																}}
															/>
														))}
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
