// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button, OutlinedInput } from "@mui/material";
import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import Loader from "components/Loader";
import OperatorContext from "contexts/OperatorContext";
import useOperator from "hooks/useOperator";
import { formatCpfCnpj } from "utils/format/formatDoc";
import { EditOutlined } from "@ant-design/icons";
import InputMask from "react-input-mask";

const OperatorDetails = () => {
	const { findOneOperatorById, updateOperator } = useOperator();

	const { loadingOperator, operatorDetails, setOperatorDetails } = useContext(OperatorContext);

	const [editOperator, setEditOperator] = useState({});
	const [openEditInput, setOpenEditInput] = useState({});

	const { id } = useParams();

	const { name, email, mobile, cpf, cnpj } = operatorDetails;

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
			newState[field] = value;
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
														<Stack direction="row" alignItems="center" spacing={1}>
															<Typography color="secondary">Email</Typography>
															{!openEditInput["email"] && <EditOutlined style={{ cursor: "pointer" }} onClick={() => handleUpdate("email")} />}
														</Stack>
														{!openEditInput["email"] ? (
															<Typography>{email}</Typography>
														) : (
															<OutlinedInput
																id="email"
																fullWidth
																type="email"
																value={editOperator["email"]}
																name="email"
																sx={{ height: "30px", mt: 0.5 }}
																inputProps={{ style: { padding: 5 } }}
																onChange={(e) => handleChangeValue("email", e.target.value)}
															/>
														)}
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
														{!openEditInput["phone"] && <EditOutlined style={{ cursor: "pointer" }} onClick={() => handleUpdate("phone")} />}
													</Stack>
													{!openEditInput["phone"] ? (
														<Typography>{mobile}</Typography>
													) : (
														<InputMask
															mask={"(99) 99999-9999"}
															value={editOperator["phone"]}
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
									{Object.keys(editOperator).length > 0 && Object.keys(openEditInput).length > 0 && (
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
