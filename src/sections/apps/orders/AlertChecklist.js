import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, FormControlLabel, Radio, RadioGroup, Stack, Typography, useTheme } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";

export default function AlertChecklist({ open, handleClose }) {
	const selectionMode = "";
	const handleChangeSelectionMode = () => {};

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
					<Stack spacing={2}>
						<Typography variant="h4" align="start">
							Checklist de inspeção
						</Typography>
						{["A", "B"].map((e) => {
							<Stack spacing={1}>
								<Typography variant="h5" align="start">
									{e.name}
								</Typography>
								<RadioGroup aria-label="size" value={selectionMode} defaultValue="N" name="radio-buttons-group" onChange={handleChangeSelectionMode} row>
									<FormControlLabel value="S" control={<Radio />} label="Conforme" />
									<FormControlLabel value="N" control={<Radio />} label="Não conforme" />
								</RadioGroup>
							</Stack>;
						})}
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button color="primary" variant="contained" onClick={() => {}} autoFocus>
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
