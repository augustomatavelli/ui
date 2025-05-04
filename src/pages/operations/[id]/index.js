import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Chip, OutlinedInput, InputLabel, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Loader from "components/Loader";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import UserContext from "contexts/UserContext";
import useOperation from "hooks/useOperation";
import OperationsContext from "contexts/OperationContext";
import AlertInfoAttributionOperation from "sections/apps/operations/AlertInfoAttributionOperation";

const OperationDetails = () => {
	const { findOneOperationById, updateOperation } = useOperation();
	const { loadingOperation, operationDetails } = useContext(OperationsContext);
	const { user } = useContext(UserContext);

	const [formData, setFormData] = useState({
		price: "",
		available: "",
		selectionMode: "",
		checklist: "",
	});
	const [editPrice, setEditPrice] = useState(false);
	const [open, setOpen] = useState(false);
	const { id } = useParams();
	const { id_service, name, category_name, price, status } = operationDetails;

	useEffect(() => {
		if (id) {
			findOneOperationById(id);
		}
	}, [id]);

	useEffect(() => {
		setFormData({
			price: operationDetails.price || "",
			available: operationDetails.available_at || "",
			selectionMode: operationDetails.visible || "",
			checklist: operationDetails.checklist || "",
		});
	}, [operationDetails]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async () => {
		try {
			const response = await updateOperation(id_service, {
				price: formData.price,
				available_at: formData.available,
				visible: formData.selectionMode,
				checklist: formData.checklist,
			});
			dispatch(
				openSnackbar({
					open: true,
					message: response.message,
					variant: "alert",
					alert: { color: "success" },
					close: false,
				})
			);
			setEditPrice(false);
			await findOneOperationById(id);
		} catch (error) {
			dispatch(
				openSnackbar({
					open: true,
					message: "Erro ao salvar alterações",
					variant: "alert",
					alert: { color: "error" },
					close: false,
				})
			);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Grid item xs={12}>
			<MainCard
				title="Detalhes do serviço"
				secondary={
					!loadingOperation && (
						<Chip
							color={status === "D" ? "success" : "error"}
							variant="filled"
							size="medium"
							label={status === "D" ? "Disponível" : "Indisponível"}
							sx={{ fontWeight: "bold", color: status === "P" ? "black" : "white" }}
						/>
					)
				}
			>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						{loadingOperation ? (
							<Loader />
						) : (
							<List sx={{ py: 0 }}>
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Nome</Typography>
												<Typography>{name}</Typography>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Categoria</Typography>
												<Typography>{category_name}</Typography>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Typography color="secondary">Preço</Typography>
												{!editPrice ? (
													<Box display="inline-flex" alignItems="center" gap={1}>
														<Typography>
															{new Intl.NumberFormat("pt-BR", {
																style: "currency",
																currency: "BRL",
															}).format(Number(price))}
														</Typography>
														<EditOutlined style={{ cursor: "pointer" }} onClick={() => setEditPrice(true)} />
													</Box>
												) : (
													<Box display="inline-flex" alignItems="center" gap={1}>
														<OutlinedInput
															id="price"
															type="number"
															name="price"
															value={formData.price}
															sx={{ height: "30px" }}
															inputProps={{ style: { padding: 5, width: "50px" } }}
															onChange={handleChange}
														/>
														<SaveOutlined style={{ cursor: "pointer" }} onClick={() => setEditPrice(false)} />
													</Box>
												)}
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<InputLabel htmlFor="available">Disponibilidade</InputLabel>
												<RadioGroup aria-label="available" value={formData.available} name="available" onChange={handleChange} row>
													<FormControlLabel value="P" control={<Radio />} label="No pouso" />
													<FormControlLabel value="D" control={<Radio />} label="Na decolagem" />
													<FormControlLabel value="A" control={<Radio />} label="Ambos" />
												</RadioGroup>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<Grid display="flex" alignItems="center" gap={1}>
													<InputLabel htmlFor="selectionMode">Tipo de atribuição do serviço</InputLabel>
													<InfoCircleOutlined onClick={() => setOpen(true)} />
												</Grid>
												<RadioGroup aria-label="selectionMode" value={formData.selectionMode} name="selectionMode" onChange={handleChange} row>
													<FormControlLabel value="S" control={<Radio />} label="Manual" />
													<FormControlLabel value="N" control={<Radio />} label="Automático" />
												</RadioGroup>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem>
									<Grid container spacing={3}>
										<Grid item xs={12} md={6}>
											<Stack spacing={0.5}>
												<InputLabel htmlFor="checklist">Necessita checklist?</InputLabel>
												<RadioGroup aria-label="checklist" value={formData.checklist} name="checklist" onChange={handleChange} row>
													<FormControlLabel value="S" control={<Radio />} label="Sim" />
													<FormControlLabel value="N" control={<Radio />} label="Não" />
												</RadioGroup>
											</Stack>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<Box sx={{ p: 2.5 }}>
									<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
										<Button variant="outlined" color="error" onClick={() => window.history.back()}>
											Voltar
										</Button>
										<Button variant="contained" onClick={handleSave}>
											Salvar
										</Button>
									</Stack>
								</Box>
							</List>
						)}
						{open && <AlertInfoAttributionOperation open={open} handleClose={handleClose} />}
					</Grid>
				</Grid>
			</MainCard>
		</Grid>
	);
};

export default OperationDetails;
