import PropTypes from "prop-types";
import { Box, Button, Dialog, DialogContent, Divider, Grid, IconButton, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import useInspection from "hooks/useInspection";
import { useContext, useEffect, useRef, useState } from "react";
import InspectionContext from "contexts/InspectionsContext";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { CheckCircleOutlined, CloseCircleOutlined, CameraFilled } from "@ant-design/icons";
export default function AlertChecklist({ open, handleClose, selectedOrder }) {
	const { findAllInspectionsByOrder, updateInspectionOrderCompliance } = useInspection();

	const { inspections, loadingInspection } = useContext(InspectionContext);

	const [objCompliance, setObjCompliance] = useState({});

	const fileInputRefs = useRef({});

	const handleChangeSelectionMode = (inspectionId, event) => {
		const value = event.target.value;
		setObjCompliance((prev) => ({ ...prev, [inspectionId]: { ...prev[inspectionId], compliance: value, observation: null } }));
	};

	const handleChangeObservation = (e, event) => {
		const value = event.target.value;
		setObjCompliance((prev) => ({
			...prev,
			[e.id_checklist_item]: {
				...prev[e.id_checklist_item],
				observation: value.trim() === "" ? null : value,
			},
		}));
	};

	const handleUpdate = async (orderId) => {
		const response = await updateInspectionOrderCompliance(orderId, objCompliance);
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
		setObjCompliance({});
		handleClose();
	};

	const handleFileChange = async (e, itemId) => {
		const file = e.target.files?.[0];
		if (file) {
			const validFormats = ["image/png", "image/jpeg"];
			const maxSize = 2 * 1024 * 1024;

			if (!validFormats.includes(file.type)) {
				dispatch(
					openSnackbar({
						open: true,
						message: "Formato inválido! Apenas PNG e JPEG são permitidos",
						variant: "alert",
						alert: { color: "warning" },
						close: false,
					})
				);
				return;
			}

			if (file.size > maxSize) {
				dispatch(
					openSnackbar({
						open: true,
						message: "O tamanho máximo permitido é 2MB",
						variant: "alert",
						alert: { color: "warning" },
						close: false,
					})
				);
				return;
			}

			let base64Image = "";
			base64Image = await readFile(file);

			setObjCompliance((prev) => ({
				...prev,
				[itemId]: {
					...prev[itemId],
					image: base64Image,
				},
			}));
		}
	};

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

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
						<Typography variant="h4" align="left">
							Checklist de inspeção
						</Typography>
						<Divider />
						{inspections.map((e, index) => {
							return (
								<>
									<Grid key={index} sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
										<Grid sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<ToggleButtonGroup
												value={objCompliance[e.id_checklist_item]?.compliance ? objCompliance[e.id_checklist_item]?.compliance : e.compliance}
												exclusive
												onChange={(event, newValue) => {
													if (newValue !== null) {
														handleChangeSelectionMode(e.id_checklist_item, { target: { value: newValue } });
													}
												}}
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
										<Grid sx={{ display: "flex", gap: 1, alignItems: "center" }}>
											<Grid>
												<TextField
													type="file"
													sx={{ display: "none" }}
													inputRef={(el) => (fileInputRefs.current[e.id_checklist_item] = el)}
													onChange={(event) => handleFileChange(event, e.id_checklist_item)}
												/>
												{objCompliance[e.id_checklist_item]?.image ? (
													<ImagePreview src={objCompliance[e.id_checklist_item].image} onClick={() => fileInputRefs.current[e.id_checklist_item]?.click()} />
												) : e.image ? (
													<ImagePreview src={e.image} onClick={() => fileInputRefs.current[e.id_checklist_item]?.click()} />
												) : (
													<IconButton
														onClick={() => fileInputRefs.current[e.id_checklist_item]?.click()}
														sx={{
															bgcolor: "grey.100",
															"&:hover": { bgcolor: "grey.200" },
														}}
													>
														<CameraFilled style={{ fontSize: 24, color: "primary.main" }} />
													</IconButton>
												)}
											</Grid>
											{objCompliance[e.id_checklist_item]?.compliance === "N" && (
												<Grid>
													<TextField
														label="Observações"
														multiline
														rows={4}
														value={objCompliance[e.id_checklist_item]?.observation || ""}
														onChange={(event) => {
															handleChangeObservation(e, event);
														}}
													/>
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
						<Button disabled={loadingInspection} onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button
							disabled={loadingInspection}
							color="primary"
							variant="contained"
							onClick={async () => {
								await handleUpdate(selectedOrder, objCompliance);
							}}
							autoFocus
						>
							Salvar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertChecklist.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
