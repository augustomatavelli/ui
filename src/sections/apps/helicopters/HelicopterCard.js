import PropTypes from "prop-types";
import { useState } from "react";
// material-ui
import { Box, Button, Chip, Dialog, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

// third-party
import { PatternFormat } from "react-number-format";

// project import
import MainCard from "components/MainCard";
import { PopupTransition } from "components/@extended/Transitions";

// assets
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import AddHelicopter from "./AddHelicopter";

const avatarImage = require.context("assets/images/users", true);

// ==============================|| CUSTOMER - CARD ||============================== //

const HelicopterCard = ({ data }) => {
	const { rab, category, image, membership, status, name, email, mobile } = data;

	const [open, setOpen] = useState(false);
	const [add, setAdd] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	/* const handleClose = () => {
		setOpen(false);
	}; */

	const handleAdd = () => {
		setAdd(!add);
	};

	return (
		<>
			<MainCard sx={{ height: 1, "& .MuiCardContent-root": { height: 1, display: "flex", flexDirection: "column" } }}>
				<Grid id="print" container spacing={2.25}>
					<Grid item xs={12} sx={{ p: 0, m: 0 }}>
						<Box
							sx={{
								width: "100%",
								height: "100%",
							}}
						>
							<img
								src={`data:image/jpeg;base64,${image}`}
								alt="Helicopter"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<ListItemText primary={<Typography variant="subtitle1">{rab}</Typography>} secondary={category} />
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
						<Box>
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									listStyle: "none",
									p: 0.5,
									m: 0,
								}}
								component="ul"
							>
								<ListItem disablePadding sx={{ width: "auto", pr: 0.75, pb: 0.75 }}>
									<Chip color={membership === "S" ? "success" : "info"} variant="filled" size="small" label={membership === "S" ? "Mensalista" : "Não mensalista"} />
								</ListItem>
								<ListItem disablePadding sx={{ width: "auto", pr: 0.75, pb: 0.75 }}>
									<Chip color={status === "A" ? "success" : "warning"} variant="filled" size="small" label={status === "A" ? "Ativo" : "Pendente"} />
								</ListItem>
							</Box>
						</Box>
					</Grid>
				</Grid>
				<Stack direction="row" className="hideforPDf" alignItems="center" spacing={1} justifyContent="flex-end" sx={{ mt: "auto", mb: 0, pt: 2.25 }}>
					<Button variant="outlined" size="small" onClick={handleClickOpen}>
						Solicitar pouso
					</Button>
				</Stack>
			</MainCard>

			{/* edit customer dialog */}
			{/* <Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} onClose={handleAdd} open={add} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddHelicopter customer={customer} onCancel={handleAdd} />
			</Dialog> */}
			{/* 	<CustomerPreview customer={customer} open={open} onClose={handleClose} /> */}
		</>
	);
};

HelicopterCard.propTypes = {
	customer: PropTypes.object,
};

export default HelicopterCard;
