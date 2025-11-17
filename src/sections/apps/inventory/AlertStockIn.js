import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, Divider, OutlinedInput, Stack, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import InventoryContext from "contexts/InventoryContext";
import { useContext, useState } from "react";
import useInventory from "hooks/useInventory";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

export default function AlertStockIn({ open, handleClose, service }) {
	const { createInventory } = useInventory();

	const { loadingInventory } = useContext(InventoryContext);

	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState("");

	const handleInputChange = (event) => {
		const value = event.target.value;

		if (value === "") {
			setInputValue("");
			setError(false);
			setHelperText("");
			return;
		}

		const number = Number(value);

		if (number <= 0) {
			setError(true);
			setHelperText("Digite um número maior que zero");
		} else {
			setError(false);
			setHelperText("");
		}

		setInputValue(value);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
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
							Registro de entrada de estoque
						</Typography>
						<Divider />
						<OutlinedInput fullWidth type="number" placeholder="Digite a quantidade..." value={inputValue} onChange={handleInputChange} error={error} inputProps={{ min: 1 }} />
						{error && (
							<Typography variant="caption" color="error">
								{helperText}
							</Typography>
						)}
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button disabled={loadingInventory} onClick={handleClose} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button
							disabled={loadingInventory || error || !inputValue}
							onClick={async () => {
								const response = await createInventory({ type: "E", amount: Number(inputValue), id_item: service });
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
								setInputValue("");
							}}
							variant="contained"
							color="primary"
						>
							Salvar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertStockIn.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
