import PropTypes from "prop-types";
// material-ui
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

// third-party

// project import
import MainCard from "components/MainCard";

// assets
import { CalendarOutlined, CalendarFilled } from "@ant-design/icons";
import dayjs from "dayjs";

const TaskCard = ({ data }) => {
	const { rab, name, email, mobile, landing_date, takeoff_date } = data;

	return (
		<>
			<MainCard
				sx={{
					height: 1,
					cursor: "pointer",
					borderRadius: 2,
					boxShadow: 3,
					transition: "all 0.3s ease-in-out",
					"&:hover": {
						boxShadow: 4,
						transform: "scale(1.02)",
					},
					"& .MuiCardContent-root": {
						height: 1,
						display: "flex",
						flexDirection: "column",
					},
				}}
			>
				<Grid id="print" container spacing={2.25}>
					<Grid item xs={12}>
						<Grid container spacing={1}>
							<Grid item xs={12}>
								<ListItemText primary={<Typography variant="subtitle1">Aeronave: {rab}</Typography>} />
								<List sx={{ p: 0, overflow: "hidden", "& .MuiListItem-root": { px: 0, py: 0.5 } }}>
									<ListItem>
										<ListItemIcon>
											<CalendarOutlined />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">Pouso: {dayjs(landing_date).format("DD/MM/YYYY HH:mm")}</Typography>} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<CalendarFilled />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">Decolagem: {takeoff_date ? dayjs(takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}</Typography>} />
									</ListItem>
									<ListItem>
										<ListItemText primary={<Typography color="secondary">{mobile}</Typography>} />
									</ListItem>
								</List>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</MainCard>
			{/* 	<Dialog maxWidth="sm" fullWidth TransitionComponent={PopupTransition} open={addRequest} sx={{ "& .MuiDialog-paper": { p: 0 } }}>
				<AddRequest aircraft={data} handleAddRequest={handleAddRequest} />
			</Dialog> */}
		</>
	);
};

TaskCard.propTypes = {
	data: PropTypes.object,
};

export default TaskCard;
