import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
// material-ui
import { Box, Button, Chip, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography, Dialog } from "@mui/material";

// third-party
import { PatternFormat } from "react-number-format";

// project import
import MainCard from "components/MainCard";

// assets
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserContext from "contexts/UserContext";
import AddRequest from "../requests/AddRequest";
import { PopupTransition } from "components/@extended/Transitions";

const AircraftCard = ({ data, setReload, reload }) => {
	const { user } = useContext(UserContext);

	const [addRequest, setAddRequest] = useState(false);

	const { id_aircraft, rab, category, image, membership, status, name, email, mobile, hasRequest } = data;

	const navigate = useNavigate();

	const handleaircraftDetailsPage = (aircraftId) => {
		navigate(`/aircrafts/${aircraftId}`);
	};

	const handleAddRequest = () => {
		setReload(!reload);
		setAddRequest(!addRequest);
	};

	return (
		<>
			<MainCard
				sx={{ height: 1, cursor: "pointer", "& .MuiCardContent-root": { height: 1, display: "flex", flexDirection: "column" } }}
				onClick={() => {
					handleaircraftDetailsPage(id_aircraft);
				}}
			>
				<Grid id="print" container spacing={2.25}>
					<Grid item xs={12} sx={{ p: 0, m: 0, height: "200px" }}>
						<img
							src={`data:image/jpeg;base64,${image}`}
							alt="Helicopter"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain",
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<ListItemText primary={<Typography variant="subtitle1">{rab}</Typography>} secondary={`Categoria ${category}`} />
								<List sx={{ p: 0, overflow: "hidden", "& .MuiListItem-root": { px: 0, py: 0.5 } }}>
									<ListItem>
										<ListItemIcon>
											<UserOutlined />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">{name}</Typography>} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<MailOutlined />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">{email}</Typography>} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<PhoneOutlined />
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography color="secondary">
													<PatternFormat displayType="text" format="(##) #####-####" mask="_" defaultValue={mobile} />
												</Typography>
											}
										/>
									</ListItem>
								</List>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								listStyle: "none",
								p: 0,
								m: 0,
							}}
							component="ul"
						>
							<ListItem disablePadding sx={{ width: "auto", pr: 0.75, pb: 0.75 }}>
								<Chip color={status === "A" ? "success" : "warning"} variant="filled" size="small" label={status === "A" ? "Ativo" : "Pendente"} sx={{ fontWeight: "bold" }} />
							</ListItem>
							<ListItem disablePadding sx={{ width: "auto", pr: 0.75, pb: 0.75 }}>
								<Chip color={membership === "S" ? "primary" : "secondary"} variant="filled" size="small" label={membership === "S" ? "Mensalista" : "Avulso"} sx={{ fontWeight: "bold" }} />
							</ListItem>
						</Box>
					</Grid>
				</Grid>
				{status === "A" && user.status === "A" && hasRequest === 0 && (
					<Stack direction="row" className="hideforPDf" alignItems="center" spacing={1} sx={{ mt: "auto", mb: 0, pt: 2.25 }}>
						<Button
							variant="outlined"
							size="small"
							onClick={(event) => {
								event.stopPropagation();
								handleAddRequest();
							}}
							sx={{ width: "100%" }}
						>
							Solicitar pouso
						</Button>
					</Stack>
				)}
			</MainCard>
			<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} open={addRequest} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddRequest aircraft={data} handleAddRequest={handleAddRequest} />
			</Dialog>
		</>
	);
};

AircraftCard.propTypes = {
	data: PropTypes.object,
};

export default AircraftCard;
