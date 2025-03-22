// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Dialog } from "@mui/material";

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

const AircraftDetails = () => {
	const { findOneAircraftById, removeLinkUserAircraft } = useAircraft();

	const { aircraftDetails, setAircraftDetails } = useContext(AircraftContext);
	const { setSearchUser, user } = useContext(UserContext);

	const [open, setOpen] = useState(false);
	const [openConfirmRemove, setOpenConfirmRemove] = useState(false);

	const { id } = useParams();

	const { id_aircraft, rab, category, image, membership, status, id_user_resp, name, email, mobile } = aircraftDetails;

	const userId = localStorage.getItem("_userId");

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

	useEffect(() => {
		findOneAircraftById(id);
	}, [id]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard title="Detalhes da aeronave">
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
											if (Number(userId) !== id_user_resp && user.type !== "A") {
												handleremoveLinkUserAircraft();
											} else {
												setOpenConfirmRemove(true);
												setSearchUser([]);
											}
										}}
									>
										Desvincular
									</Button>
									{(Number(userId) === id_user_resp || user.type === "A") && (
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
												<Typography color="secondary">RAB</Typography>
												<Typography>{rab}</Typography>
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
												<Typography color="secondary">Nome do responsável</Typography>
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
												<Typography color="secondary">Email do responsável</Typography>
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
												<Typography color="secondary">Celular do responsável</Typography>
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
							</List>
							<Box sx={{ p: 2.5 }}>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }}>
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
		</>
	);
};

export default AircraftDetails;
