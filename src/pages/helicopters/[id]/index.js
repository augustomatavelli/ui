// material-ui
import { Grid, List, ListItem, Stack, Typography, Divider, Box, Button } from "@mui/material";

// project import
import MainCard from "components/MainCard";
import { useContext, useEffect } from "react";
import HelicopterContext from "contexts/HelicopterContext";
import useHelicopter from "hooks/useHelicopter";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

const HelicopterDetails = () => {
	const { findOneHelicopterById, removeLinkUserHelicopter } = useHelicopter();

	const { helicopterDetails } = useContext(HelicopterContext);

	const { id } = useParams();

	const { id_helicopter, rab, category, image, membership, status, name, email, mobile } = helicopterDetails;

	const handleRemoveHelicopter = async () => {
		const response = await removeLinkUserHelicopter(id_helicopter);
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
		window.history.back();
	};

	const formatPhoneNumber = (number) => {
		const cleaned = ("" + number).replace(/\D/g, "");
		const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		}
		return number;
	};

	useEffect(() => {
		findOneHelicopterById(id);
	}, [id]);

	return (
		<Grid item xs={12} sm={7} md={8} xl={9}>
			<MainCard title="Detalhes do helicóptero">
				<Grid container spacing={3}>
					<Grid item xs={12} sm={4} md={3}>
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
							<img
								src={`data:image/jpeg;base64,${image}`}
								alt="Helicopter"
								style={{
									width: "100%",
									height: "200px",
									objectFit: "contain",
								}}
							/>
							<Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
								<Button variant="contained" color="primary" onClick={() => {}}>
									Vincular
								</Button>
								<Button variant="contained" color="warning" onClick={handleRemoveHelicopter}>
									Desvincular
								</Button>
							</Stack>
						</Box>
					</Grid>
					<Grid item xs={12} sm={8} md={9}>
						<List sx={{ py: 0 }}>
							<ListItem>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Stack spacing={0.5}>
											<Typography color="secondary">RAB</Typography>
											<Typography>{rab}</Typography>
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
											<Typography>{category}</Typography>
										</Stack>
									</Grid>
								</Grid>
							</ListItem>
							<Divider />
							<ListItem>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Stack spacing={0.5}>
											<Typography color="secondary">Nome do responsável</Typography>
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
											<Typography color="secondary">Email do responsável</Typography>
											<Typography>{email}</Typography>
										</Stack>
									</Grid>
								</Grid>
							</ListItem>
							<Divider />
							<ListItem>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Stack spacing={0.5}>
											<Typography color="secondary">Situação</Typography>
											<Typography>{status === "A" ? "Aprovado" : status === "P" ? "Pendente" : "Inativo"}</Typography>
										</Stack>
									</Grid>
								</Grid>
							</ListItem>
							<Divider />
							<ListItem>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Stack spacing={0.5}>
											<Typography color="secondary">Mensalista</Typography>
											<Typography>{membership === "S" ? "Sim" : "Não"}</Typography>
										</Stack>
									</Grid>
								</Grid>
							</ListItem>
							<Divider />
							<ListItem>
								<Grid container spacing={3}>
									<Grid item xs={12} md={6}>
										<Stack spacing={0.5}>
											<Typography color="secondary">Celular do responsável</Typography>
											<Typography>{formatPhoneNumber(mobile)}</Typography>
										</Stack>
									</Grid>
								</Grid>
							</ListItem>
						</List>
						<Box sx={{ p: 2.5 }}>
							<Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2.5 }}>
								<Button variant="outlined" color="error" onClick={() => window.history.back()}>
									Voltar
								</Button>
							</Stack>
						</Box>
					</Grid>
				</Grid>
			</MainCard>
		</Grid>
	);
};

export default HelicopterDetails;
