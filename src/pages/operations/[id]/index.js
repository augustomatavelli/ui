import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, Chip, OutlinedInput, InputLabel, RadioGroup, Radio, FormControlLabel, IconButton, Select, MenuItem, Tooltip } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Loader from "components/Loader";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import useOperation from "hooks/useOperation";
import useChecklist from "hooks/useChecklists";
import OperationsContext from "contexts/OperationContext";
import { ChecklistContext } from "contexts/ChecklistContext";
import AlertInfoAttributionOperation from "sections/apps/operations/AlertInfoAttributionOperation";
import { ErrorMessages } from "utils/errors-messages/errors-messages";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";
import { AVAILABILITY, PRODUCT_STATUS, YES_NO } from "constants/domain";

const OperationDetails = () => {
	const { findOneOperationById, updateOperation, deleteOperation } = useOperation();
	const { findAllActive } = useChecklist();
	const { loadingOperation, operationDetails } = useContext(OperationsContext);
	const { activeChecklists } = useContext(ChecklistContext);

	const [formData, setFormData] = useState({
		price: "",
		available: "",
		selectionMode: "",
		checklist: "",
		allow_schedule: "",
		id_checklist: "",
	});
	const [editPrice, setEditPrice] = useState(false);
	const [open, setOpen] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);

	const { id } = useParams();
	const { id_service, name, category_name, price, status, checklist_name, id_checklist } = operationDetails;

	useEffect(() => {
		if (id) {
			findOneOperationById(id);
		}
	}, [id]);

	useEffect(() => {
		findAllActive();
	}, []);

	useEffect(() => {
		setFormData({
			price: operationDetails.price || "",
			available: operationDetails.available_at || "",
			stock: operationDetails.stock || "",
			selectionMode: operationDetails.visible || "",
			checklist: operationDetails.checklist || "",
			allow_schedule: operationDetails.allow_schedule || "",
			checklist_name: operationDetails.checklist_name || "",
			id_checklist: operationDetails.id_checklist || "",
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
				inventory: formData.stock,
				visible: formData.selectionMode,
				checklist: formData.checklist,
				allow_schedule: formData.allow_schedule,
				id_checklist: formData.id_checklist,
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
			const err = error.response.data.errors[0].type || error.response.data.errors[0].message;

			dispatch(
				openSnackbar({
					open: true,
					message: ErrorMessages[err] ?? "Erro ao salvar alterações",
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

	const handleAlertClose = () => {
		setOpenAlert(!openAlert);
	};

	return (
		<Grid item xs={12}>
			<MainCard
				title="Detalhes do serviço"
				secondary={
					!loadingOperation && (
						<Chip
							color={status === PRODUCT_STATUS.AVAILABLE ? "success" : "error"}
							variant="filled"
							size="medium"
							label={status === PRODUCT_STATUS.AVAILABLE ? "Disponível" : "Indisponível"}
							sx={{ fontWeight: "bold", color: status === PRODUCT_STATUS.PENDING ? "#252525" : "white" }}
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
														<Tooltip title="Editar preço">
															<IconButton size="small" aria-label="Editar preço" onClick={() => setEditPrice(true)}>
																<EditOutlined />
															</IconButton>
														</Tooltip>
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
														<Tooltip title="Salvar preço">
															<IconButton size="small" aria-label="Salvar preço" onClick={() => setEditPrice(false)}>
																<SaveOutlined />
															</IconButton>
														</Tooltip>
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
													<FormControlLabel value={AVAILABILITY.LANDING} control={<Radio />} label="No pouso" />
													<FormControlLabel value={AVAILABILITY.TAKEOFF} control={<Radio />} label="Na decolagem" />
													<FormControlLabel value={AVAILABILITY.BOTH} control={<Radio />} label="Ambos" />
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
													<InputLabel htmlFor="stock">Controle de estoque?</InputLabel>
												</Grid>
												<RadioGroup aria-label="stock" value={formData.stock} name="stock" onChange={handleChange} row>
													<FormControlLabel value={YES_NO.YES} control={<Radio />} label="Sim" />
													<FormControlLabel value={YES_NO.NO} control={<Radio />} label="Não" />
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
													<FormControlLabel value={YES_NO.YES} control={<Radio />} label="Manual" />
													<FormControlLabel value={YES_NO.NO} control={<Radio />} label="Automático" />
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
													<FormControlLabel value={YES_NO.YES} control={<Radio />} label="Sim" />
													<FormControlLabel value={YES_NO.NO} control={<Radio />} label="Não" />
													<Select
														value={formData.id_checklist || ""}
														name="id_checklist"
														onChange={handleChange}
														displayEmpty
														disabled={formData.checklist === YES_NO.NO}
														inputProps={{ "aria-label": "Without label" }}
														sx={{ width: "fit-content", marginTop: 1 }}
													>
														<MenuItem value="" disabled>
															Selecione um checklist
														</MenuItem>
														{activeChecklists.map((checklist) => (
															<MenuItem key={checklist.id_checklist} value={checklist.id_checklist}>
																{checklist.name}
															</MenuItem>
														))}
													</Select>
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
												<InputLabel htmlFor="allow_schedule">Necessita reserva?</InputLabel>
												<RadioGroup aria-label="allow_schedule" value={formData.allow_schedule} name="allow_schedule" onChange={handleChange} row>
													<FormControlLabel value={YES_NO.YES} control={<Radio />} label="Sim" />
													<FormControlLabel value={YES_NO.NO} control={<Radio />} label="Não" />
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
										<Button
											variant="contained"
											color="error"
											onClick={() => {
												setOpenAlert(true);
											}}
										>
											Excluir
										</Button>
										<AlertCustomerDelete title={name} open={openAlert} handleClose={handleAlertClose} id={Number(id_service)} handleDelete={deleteOperation} />
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
