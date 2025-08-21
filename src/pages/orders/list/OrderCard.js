import PropTypes from "prop-types";
import { Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import MainCard from "components/MainCard";
import { CalendarOutlined, CalendarFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const OrderCard = ({ data }) => {
	const { id_request, registration, landing_date, takeoff_date, itemOrders } = data;

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
								<ListItemText primary={<Typography variant="h5"># {id_request}</Typography>} secondary={<Typography variant="h5">{registration}</Typography>} />
								<List sx={{ p: 0, overflow: "hidden", "& .MuiListItem-root": { px: 0, py: 0.5 } }}>
									<ListItem>
										<ListItemIcon>
											<CalendarOutlined />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">Pouso: {dayjs.utc(landing_date).format("DD/MM/YYYY HH:mm")}</Typography>} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<CalendarFilled />
										</ListItemIcon>
										<ListItemText primary={<Typography color="secondary">Decolagem: {takeoff_date ? dayjs.utc(takeoff_date).format("DD/MM/YYYY HH:mm") : "Não agendado"}</Typography>} />
									</ListItem>
									{itemOrders.map((item, index) => (
										<ListItem key={index}>
											<ListItemText
												primary={
													<Typography color="secondary">{item.unit === "un" ? item.name : item.unit === "L" ? `${item.name} ${item.amount}${item.unit}` : `${item.amount}x ${item.name}`}</Typography>
												}
											/>
										</ListItem>
									))}
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

OrderCard.propTypes = {
	data: PropTypes.object,
};

export default OrderCard;
