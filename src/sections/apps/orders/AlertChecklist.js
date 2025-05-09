import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import useInspection from "hooks/useInspection";
import { useContext, useEffect, useState } from "react";
import InspectionContext from "contexts/InspectionsContext";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { CheckCircleOutlined, CloseCircleOutlined, CameraFilled } from "@ant-design/icons";
export default function AlertChecklist({ open, handleClose, selectedOrder }) {
	const { findAllInspectionsByOrder, updateInspectionOrderCompliance } = useInspection();

	const { inspections } = useContext(InspectionContext);

	const [objCompliance, setObjCompliance] = useState({});

	const handleChangeSelectionMode = (inspectionId, event) => {
		const value = event.target.value;
		setObjCompliance((prev) => ({ ...prev, [inspectionId]: value }));
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
		handleClose();
	};

	useEffect(() => {
		if (open) {
			findAllInspectionsByOrder(selectedOrder);
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="xs"
			fullWidth
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="start" spacing={3.5}>
					<Stack spacing={2}>
						<Typography variant="h4" align="start">
							Checklist de inspeção
						</Typography>
						{inspections.map((e) => {
							return (
								<Stack spacing={1} direction="row" alignItems="center" gap={2}>
									<ToggleButtonGroup
										value={objCompliance[e.id_inspection] ?? ""}
										exclusive
										onChange={(event, newValue) => {
											if (newValue !== null) {
												handleChangeSelectionMode(e.id_inspection, { target: { value: newValue } });
											}
										}}
										aria-label="conformidade"
									>
										<ToggleButton
											value="S"
											aria-label="conforme"
											sx={{
												"&.Mui-selected": {
													bgcolor: "green",
													color: "white",
												},
												"&:not(.Mui-selected)": {
													bgcolor: "white",
													color: "black",
												},
											}}
										>
											<CheckCircleOutlined style={{ fontSize: 24, color: "inherit" }} />
										</ToggleButton>
										<ToggleButton
											value="N"
											aria-label="nao-conforme"
											sx={{
												"&.Mui-selected": {
													bgcolor: "red",
													color: "white",
												},
												"&:not(.Mui-selected)": {
													bgcolor: "white",
													color: "black",
												},
											}}
										>
											<CloseCircleOutlined style={{ fontSize: 24, color: "inherit" }} />
										</ToggleButton>
									</ToggleButtonGroup>
									<Typography variant="h5" align="start">
										{e.name}
									</Typography>
									<CameraFilled style={{ fontSize: 18 }} />
								</Stack>
							);
						})}
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button
							color="primary"
							variant="contained"
							onClick={() => {
								handleUpdate(selectedOrder, objCompliance);
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
