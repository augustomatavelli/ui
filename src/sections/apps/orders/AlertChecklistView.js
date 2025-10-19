import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import useInspection from "hooks/useInspection";
import { useContext, useEffect, useRef, useState } from "react";
import InspectionContext from "contexts/InspectionsContext";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

export default function AlertChecklistView({ open, handleClose, selectedOrder }) {
	const { findAllInspectionsByOrder } = useInspection();

	const { inspections } = useContext(InspectionContext);

	const [objCompliance, setObjCompliance] = useState({});

	const fileInputRefs = useRef({});

	const ImagePreview = ({ src, onClick }) => (
		<Box
			sx={{
				position: "relative",
				"&:hover": { opacity: 0.9 },
				cursor: "pointer",
			}}
			onClick={onClick}
		>
			<img
				src={src}
				alt="Preview"
				style={{
					width: 80,
					height: 80,
					objectFit: "cover",
					borderRadius: 8,
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			/>
		</Box>
	);

	useEffect(() => {
		if (open) {
			findAllInspectionsByOrder(selectedOrder);
		}
	}, [open]);

	useEffect(() => {
		if (inspections.length > 0) {
			const initialCompliance = {};
			inspections.forEach((item) => {
				initialCompliance[item.id_checklist_item] = {
					compliance: item.compliance ?? null,
					image: item.image ?? null,
					observation: item.observation ?? null,
				};
			});
			setObjCompliance(initialCompliance);
		}
	}, [inspections]);

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="sm"
			fullWidth
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="start" spacing={3.5}>
					<Stack spacing={2} width={1}>
						<Typography variant="h4" align="start">
							Checklist de inspeção
						</Typography>
						<Divider />
						{inspections.map((e, index) => {
							return (
								<>
									<Grid key={Math.random()} sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
										<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: 80 }}>
											<Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
												<ToggleButtonGroup
													value={objCompliance[e.id_checklist_item]?.compliance ? objCompliance[e.id_checklist_item]?.compliance : e.compliance}
													exclusive
													size="small"
													sx={{ borderRadius: 2, overflow: "hidden" }}
												>
													<ToggleButton
														value="S"
														sx={{
															p: 1,
															transition: "all 0.2s ease",
															"&.Mui-selected": {
																bgcolor: "success.main",
																color: "white",
																"&:hover": { bgcolor: "success.dark" },
															},
															"&:not(.Mui-selected)": {
																bgcolor: "grey.100",
																color: "grey.600",
															},
														}}
													>
														<CheckCircleOutlined style={{ fontSize: 28 }} />
													</ToggleButton>
													<ToggleButton
														value="N"
														sx={{
															p: 1,
															transition: "all 0.2s ease",
															"&.Mui-selected": {
																bgcolor: "error.main",
																color: "white",
																"&:hover": { bgcolor: "error.dark" },
															},
															"&:not(.Mui-selected)": {
																bgcolor: "grey.100",
																color: "grey.600",
															},
														}}
													>
														<CloseCircleOutlined style={{ fontSize: 28 }} />
													</ToggleButton>
												</ToggleButtonGroup>

												<Typography variant="h5" color="text.secondary" align="start">
													{e.name}
												</Typography>
											</Grid>

											{e.user_name && (
												<Typography variant="h6" color="text.secondary" align="start" sx={{ mt: 0.5 }}>
													Inspeção realizada por {e.user_name}
												</Typography>
											)}
										</Box>

										<Grid sx={{ display: "flex", gap: 1, alignItems: "center" }}>
											<Grid>
												<TextField type="file" sx={{ display: "none" }} inputRef={(el) => (fileInputRefs.current[e.id_checklist_item] = el)} />
												{objCompliance[e.id_checklist_item]?.image ? (
													<ImagePreview src={objCompliance[e.id_checklist_item].image} onClick={() => fileInputRefs.current[e.id_checklist_item]?.click()} />
												) : e.image ? (
													<ImagePreview src={e.image} onClick={() => fileInputRefs.current[e.id_checklist_item]?.click()} />
												) : (
													<></>
												)}
											</Grid>
											{objCompliance[e.id_checklist_item]?.compliance === "N" && (
												<Grid>
													<TextField label="Observações" multiline rows={4} value={objCompliance[e.id_checklist_item]?.observation || ""} disabled />
												</Grid>
											)}
										</Grid>
									</Grid>
									<Divider />
								</>
							);
						})}
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertChecklistView.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
