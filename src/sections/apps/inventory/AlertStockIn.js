import PropTypes from "prop-types";
import { Avatar, Button, Dialog, DialogContent, Divider, Grid, IconButton, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import InventoryContext from "contexts/InventoryContext";
import { useContext, useRef, useState } from "react";
import useInventory from "hooks/useInventory";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import { CameraFilled } from "@ant-design/icons";

export default function AlertStockIn({ open, handleClose, handleSave, service }) {
	const { createInventory } = useInventory();

	const { loadingInventory } = useContext(InventoryContext);

	const [inputValue, setInputValue] = useState("");
	const [error, setError] = useState(false);
	const [helperText, setHelperText] = useState("");
	const [imageRecipe, setImageRecipe] = useState("");
	const [imagePreview, setImagePreview] = useState(null);

	const fileInputRef = useRef(null);

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

	const handleFileChange = async (e) => {
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

			setImagePreview(URL.createObjectURL(file));
			let base64Image = "";
			base64Image = await readFile(file);

			setImageRecipe(base64Image);
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

	const handleCloseDialog = () => {
		handleClose();
		setInputValue("");
		setImageRecipe("");
		setImagePreview(null);
		setError(false);
		setHelperText("");
	};

	return (
		<Dialog
			open={open}
			onClose={handleCloseDialog}
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
						<Grid spacing={2} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
							<Grid item xs={12} sm="auto">
								<TextField type="file" sx={{ display: "none" }} inputRef={fileInputRef} onChange={(event) => handleFileChange(event)} accept="image/png, image/jpeg" />
								<IconButton
									onClick={() => fileInputRef.current?.click()}
									sx={{
										bgcolor: "grey.100",
										"&:hover": { bgcolor: "grey.200" },
										width: "100%",
										justifyContent: "space-between",
										p: 2,
										gap: 2,
									}}
								>
									<CameraFilled style={{ fontSize: 24, color: "primary.main" }} />
									Adicionar
								</IconButton>
							</Grid>
							{imagePreview && (
								<Grid item>
									<Avatar src={imagePreview} alt="Nota Fiscal" sx={{ width: 56, height: 56 }} />
								</Grid>
							)}
						</Grid>
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button disabled={loadingInventory} onClick={handleCloseDialog} color="secondary" variant="outlined">
							Fechar
						</Button>
						<Button
							disabled={loadingInventory || error || !inputValue}
							onClick={async () => {
								const response = await createInventory({ type: "E", amount: Number(inputValue), id_item: service, receipt: imageRecipe });
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
								handleCloseDialog();
								handleSave();
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
	service: PropTypes.number,
};
