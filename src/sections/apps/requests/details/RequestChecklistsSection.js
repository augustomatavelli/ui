import PropTypes from "prop-types";
import { memo } from "react";
import { Grid, ListItem, Typography, Divider, Box, Button, Collapse, Card, useTheme } from "@mui/material";
import { UpOutlined, DownOutlined, FileSearchOutlined } from "@ant-design/icons";

const RequestChecklistsSection = ({ open, setOpen, checklists, id_landing_order, handleOpenChecklist }) => {
	const theme = useTheme();

	return (
		<>
			<ListItem onClick={() => setOpen(!open)} sx={{ cursor: "pointer" }}>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={6}>
						<Typography color="secondary">Checklists</Typography>
					</Grid>
					<Grid item xs={6} display="flex" justifyContent="flex-end">
						<Button type="secondary" onClick={() => setOpen(!open)} color="secondary">
							{open ? <UpOutlined /> : <DownOutlined />}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Collapse in={open}>
							<Box sx={{ padding: 0 }}>
								<Grid>
									<Box
										sx={{
											display: "flex",
											overflowX: "auto",
											gap: 2,
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
										}}
									>
										{checklists &&
											checklists.map((e, index) => {
												return (
													<Card
														sx={{
															p: 2,
															width: "200px",
															border: "2px solid",
															borderColor: e.compliance ? theme.palette.success.light : theme.palette.error.light,
														}}
														onClick={(event) => handleOpenChecklist(event, id_landing_order)}
														key={index}
													>
														<Grid sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
															<FileSearchOutlined style={{ fontSize: "20px" }} />
															{e.name}
														</Grid>
													</Card>
												);
											})}
									</Box>
								</Grid>
							</Box>
						</Collapse>
					</Grid>
				</Grid>
			</ListItem>
			<Divider />
		</>
	);
};

RequestChecklistsSection.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	checklists: PropTypes.array,
	id_landing_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	handleOpenChecklist: PropTypes.func,
};

export default memo(RequestChecklistsSection);
