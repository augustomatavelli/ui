import PropTypes from "prop-types";
import { memo } from "react";
import { Grid, ListItem, Typography, Divider, Box, Button, Chip, Collapse, CircularProgress, List } from "@mui/material";
import { UpOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { OperationsList } from "sections/apps/requests/OperationsList";

const scrollBoxSx = {
	display: "flex",
	overflowX: "auto",
	padding: "1rem",
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
};

const RequestServicesSection = ({
	open,
	setOpen,
	openAddServices,
	setOpenAddServices,
	loadingOperation,
	editRequest,
	status,
	checked,
	setChecked,
	searchOperations,
	searchAllOperations,
	handleOpenEditInput,
	handleDeleteService,
	handleChange,
	handleCheckboxChange,
}) => {
	return (
		<>
			<ListItem onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={6}>
						<Typography color="secondary">Serviços</Typography>
					</Grid>
					<Grid item xs={6} display="flex" justifyContent="flex-end">
						<Button type="secondary" onClick={() => setOpen(!open)} color="secondary">
							{open ? <UpOutlined /> : <DownOutlined />}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Collapse in={open}>
							<Box sx={{ padding: 0 }}>
								{!openAddServices ? (
									<>
										<List sx={{ padding: 0, display: "flex", gap: 1, width: "fit-content" }}>
											{editRequest.services &&
												editRequest.services.length > 0 &&
												editRequest.services.map(
													(e) =>
														(Number(e.amount) > 0 || e.amount === "full") && (
															<Chip
																label={e.unit === "un" ? `${e.name}` : e.amount === "full" ? "Full" : `${e.name} ${e.amount} ${e.unit}`}
																onDelete={() => {
																	handleOpenEditInput("services");
																	handleDeleteService(e.id_service);
																}}
																key={e.id_service}
																sx={{ alignSelf: "start", borderRadius: "16px" }}
																disabled={status === "F" || status === "R"}
															/>
														)
												)}
										</List>
										{status === "A" && (
											<Grid sx={{ mt: 2 }}>
												<Button
													variant="contained"
													size="small"
													startIcon={<PlusOutlined />}
													onClick={async (event) => {
														event.stopPropagation();
														await searchAllOperations();
														handleOpenEditInput("services");
														setOpenAddServices(true);
													}}
												>
													Adicionar
												</Button>
											</Grid>
										)}
									</>
								) : loadingOperation ? (
									<CircularProgress size={20} />
								) : (
									<Grid>
										<Box sx={scrollBoxSx}>
											<OperationsList
												checked={checked}
												setChecked={setChecked}
												searchOperations={searchOperations}
												requestObject={editRequest}
												handleChange={handleChange}
												handleCheckboxChange={handleCheckboxChange}
											/>
										</Box>
									</Grid>
								)}
							</Box>
						</Collapse>
					</Grid>
				</Grid>
			</ListItem>
			<Divider />
		</>
	);
};

RequestServicesSection.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	openAddServices: PropTypes.bool,
	setOpenAddServices: PropTypes.func,
	loadingOperation: PropTypes.bool,
	editRequest: PropTypes.object,
	status: PropTypes.string,
	checked: PropTypes.object,
	setChecked: PropTypes.func,
	searchOperations: PropTypes.array,
	searchAllOperations: PropTypes.func,
	handleOpenEditInput: PropTypes.func,
	handleDeleteService: PropTypes.func,
	handleChange: PropTypes.func,
	handleCheckboxChange: PropTypes.func,
};

export default memo(RequestServicesSection);
