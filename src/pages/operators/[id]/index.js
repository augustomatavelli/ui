// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, OutlinedInput, IconButton, Tooltip } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import Loader from "components/Loader";
import OperatorContext from "contexts/OperatorContext";
import useOperator from "hooks/useOperator";
import { formatCpfCnpj } from "utils/format/formatDoc";
import { EditOutlined } from "@ant-design/icons";
import InputMask from "react-input-mask";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const OperatorDetails = () => {
	const { findOneOperatorById, updateOperator } = useOperator();

	const { loadingOperator, operatorDetails, setOperatorDetails } = useContext(OperatorContext);

	const [editOperator, setEditOperator] = useState({});
	const [openEditInput, setOpenEditInput] = useState({});

	const { id } = useParams();

	const { name, emails, mobile, cpf, cnpj, social } = operatorDetails;

	const handleUpdate = (field) => {
		setOpenEditInput((prev) => {
			const newState = { ...prev };

			if (newState[field]) {
				delete newState[field];
			} else {
				newState[field] = true;
			}

			return newState;
		});
	};

	const handleChangeValue = (field, value) => {
		setEditOperator((prev) => {
			const newState = { ...prev };

			if (field.startsWith("email")) {
				const emailIndex = parseInt(field.replace("email", ""));
				const updatedEmails = [...(prev.emails || emails || [])];
				updatedEmails[emailIndex] = value;

				newState.emails = updatedEmails;
				newState[field] = value;
			} else {
				newState[field] = value;
			}

			return newState;
		});
	};

	const handleEditSave = async () => {
		const response = await updateOperator(Number(id), editOperator);
		if (!response.errors) {
			setEditOperator({});
			setOpenEditInput({});
			await findOneOperatorById(id);
		}
	};

	const handleAddEmail = () => {
		const currentEmails = operatorDetails.emails || [];
		if (currentEmails.length >= 8) {
			return;
		}

		const newIndex = currentEmails.length;
		const updatedEmails = [...currentEmails, ""];

		setOperatorDetails((prev) => ({
			...prev,
			emails: [...(prev.emails || []), ""],
		}));

		setEditOperator((prev) => ({
			...prev,
			emails: updatedEmails,
		}));

		setOpenEditInput((prev) => ({
			...prev,
			[`email${newIndex}`]: true,
			emails: true,
		}));
	};

	const handleRemoveEmail = (indexToRemove) => {
		const currentEmails = operatorDetails.emails || [];
		if (currentEmails.length <= 1) {
			return;
		}

		const updatedEmails = currentEmails.filter((_, index) => index !== indexToRemove);

		setOperatorDetails((prev) => ({
			...prev,
			emails: (prev.emails || []).filter((_, index) => index !== indexToRemove),
		}));

		setEditOperator((prev) => ({
			...prev,
			emails: updatedEmails,
		}));

		setOpenEditInput((prev) => {
			const newState = { ...prev, emails: true };
			delete newState[`email${indexToRemove}`];
			return newState;
		});
	};

	useEffect(() => {
		findOneOperatorById(id);
	}, [id]);

	return (
		<>
			<Grid item xs={12} sm={7} md={8} xl={9}>
				<MainCard title="Detalhes do operador">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							{loadingOperator ? (
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
													<Stack spacing={0.5}>
														<Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
															<Typography color="secondary">Email</Typography>
															{emails && emails.length < 8 && (
																<Tooltip title="Adicionar email">
																	<IconButton
																		size="small"
																		color="primary"
																		aria-label="Adicionar email"
																		onClick={() => handleAddEmail()}
																		disabled={loadingOperator}
																		sx={{
																			border: 1,
																			borderColor: "primary.main",
																			backgroundColor: "transparent",
																			"&:hover": {
																				backgroundColor: "primary.main",
																				color: "white",
																			},
																		}}
																	>
																		<AddIcon />
																	</IconButton>
																</Tooltip>
															)}
														</Stack>

														{emails?.map((email, index) => (
															<Stack key={email ? `email-${email}` : `email-new-${index}`} direction="row" alignItems="center" spacing={1}>
																{!openEditInput[`email${index}`] ? (
																	<>
																		<Typography sx={{ flex: 1 }}>{email}</Typography>
																		<Box display="flex" gap={0.5}>
																			<Tooltip title="Editar email">
																				<IconButton
																					size="small"
																					aria-label="Editar email"
																					onClick={() => handleUpdate(`email${index}`)}
																					disabled={loadingOperator}
																					sx={{
																						border: 1,
																						borderColor: "secondary.main",
																						backgroundColor: "transparent",
																						"&:hover": {
																							backgroundColor: "secondary.main",
																							color: "white",
																						},
																					}}
																				>
																					<EditOutlined />
																				</IconButton>
																			</Tooltip>
																			{emails.length > 1 && (
																				<Tooltip title="Remover email">
																					<IconButton
																						size="small"
																						color="error"
																						aria-label="Remover email"
																						onClick={() => handleRemoveEmail(index)}
																						disabled={loadingOperator}
																						sx={{
																							border: 1,
																							borderColor: "error.main",
																							backgroundColor: "transparent",
																							"&:hover": {
																								backgroundColor: "error.main",
																								color: "white",
																							},
																						}}
																					>
																						<RemoveIcon />
																					</IconButton>
																				</Tooltip>
																			)}
																		</Box>
																	</>
																) : (
																	<Box display="flex" alignItems="center" spacing={1} width="100%" gap={2}>
																		<OutlinedInput
																			id={`email${index}`}
																			fullWidth
																			type="email"
																			value={editOperator[`email${index}`] || email}
																			name={`email${index}`}
																			sx={{ height: "30px", mt: 0.5 }}
																			inputProps={{ style: { padding: 5 } }}
																			onChange={(e) => handleChangeValue(`email${index}`, e.target.value)}
																		/>
																		<Tooltip title="Remover email">
																			<IconButton
																				size="small"
																				color="error"
																				aria-label="Remover email"
																				onClick={() => handleRemoveEmail(index)}
																				disabled={loadingOperator}
																				sx={{
																					border: 1,
																					borderColor: "error.main",
																					backgroundColor: "transparent",
																					"&:hover": {
																						backgroundColor: "error.main",
																						color: "white",
																					},
																				}}
																			>
																				<RemoveIcon />
																			</IconButton>
																		</Tooltip>
																	</Box>
																)}
															</Stack>
														))}
													</Stack>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Stack direction="row" alignItems="center" spacing={1}>
														<Typography color="secondary">Celular</Typography>
														{!openEditInput["phone"] && (
															<Tooltip title="Editar celular">
																<IconButton size="small" aria-label="Editar celular" onClick={() => handleUpdate("phone")} disabled={loadingOperator}>
																	<EditOutlined />
																</IconButton>
															</Tooltip>
														)}
													</Stack>
													{!openEditInput["phone"] ? (
														<Typography>{mobile}</Typography>
													) : (
														<InputMask
															mask={"(99) 99999-9999"}
															value={editOperator["phone"] ?? mobile ?? ""}
															sx={{ width: "100%" }}
															onChange={(e) => {
																handleChangeValue("phone", e.target.value);
															}}
														>
															{() => (
																<OutlinedInput
																	id="phone-signup"
																	name="phone"
																	sx={{ height: "30px" }}
																	inputProps={{
																		style: { padding: 5, width: "100%" },
																	}}
																/>
															)}
														</InputMask>
													)}
													<Typography>{}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Typography color="secondary">Documento</Typography>
													<Typography>{formatCpfCnpj(`${cpf ? cpf : cnpj}`)}</Typography>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
									<ListItem>
										<Grid container spacing={3}>
											<Grid item xs={12} md={6}>
												<Stack spacing={0.5}>
													<Stack spacing={0.5}>
														<Stack direction="row" alignItems="center" spacing={1}>
															<Typography color="secondary">Razão social</Typography>
															{!openEditInput["social"] && (
																<Tooltip title="Editar razão social">
																	<IconButton size="small" aria-label="Editar razão social" onClick={() => handleUpdate("social")} disabled={loadingOperator}>
																		<EditOutlined />
																	</IconButton>
																</Tooltip>
															)}
														</Stack>
														{!openEditInput["social"] ? (
															<Typography>{social}</Typography>
														) : (
															<OutlinedInput
																id="social"
																fullWidth
																type="social"
																value={editOperator["social"]}
																name="social"
																sx={{ height: "30px", mt: 0.5 }}
																inputProps={{ style: { padding: 5 } }}
																onChange={(e) => handleChangeValue("social", e.target.value)}
															/>
														)}
													</Stack>
												</Stack>
											</Grid>
										</Grid>
									</ListItem>
									<Divider />
								</List>
							)}
							<Box sx={{ p: 2.5 }}>
								<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }} spacing={2}>
									<Button
										variant="outlined"
										color="error"
										onClick={() => {
											window.history.back();
											setOperatorDetails({});
										}}
									>
										Voltar
									</Button>
									{Object.keys(editOperator).length > 0 && (
										<Button variant="contained" onClick={handleEditSave}>
											Salvar
										</Button>
									)}
								</Stack>
							</Box>
						</Grid>
					</Grid>
				</MainCard>
			</Grid>
		</>
	);
};

export default OperatorDetails;
