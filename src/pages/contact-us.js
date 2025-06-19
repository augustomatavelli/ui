import { Grid, Box, Typography, Link } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useContext, useEffect } from "react";
import UserContext from "contexts/UserContext";

const ContactUs = () => {
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<Grid container spacing={4} justifyContent="center" alignItems="flex-start" sx={{ mb: { xs: 0, md: 0 }, mt: { xs: 4, md: 8 } }}>
			<Grid item xs={12} md={6} lg={5}>
				<Box sx={{ px: { xs: 2, md: 4 } }}>
					<Typography variant="h3" color="primary" fontWeight="bold" gutterBottom>
						CONTATOS
					</Typography>
					<Typography variant="body1">Av. Mal. Mascarenhas de Morais, 3000 - Imbiribeira, Recife - PE</Typography>

					<Box mt={3}>
						<Typography variant="subtitle1" color="primary" fontWeight="bold">
							Telefone
						</Typography>
						<Typography variant="body1">+55 (81) 99114-4483</Typography>
					</Box>

					<Box mt={2}>
						<Typography variant="subtitle1" color="primary" fontWeight="bold">
							Whatsapp
						</Typography>
						<Typography variant="body1">+55 (81) 99114-4483</Typography>
					</Box>

					<Box mt={2}>
						<Typography variant="subtitle1" color="primary" fontWeight="bold">
							Horários
						</Typography>
						<Typography variant="body1">De segunda a sexta, das 8h às 18h. Sábado, das 8h às 12h.</Typography>
					</Box>
				</Box>
			</Grid>

			<Grid item xs={12} md={6} lg={5} style={{ height: 345 }}>
				<Box
					sx={{
						borderRadius: 2,
						overflow: "hidden",
						height: "100%",
						boxShadow: 2,
					}}
				>
					<iframe
						title="Localização"
						src="https://www.google.com/maps?q=Av.+Mal.+Mascarenhas+de+Morais,+3000+-+Imbiribeira,+Recife+-+PE&output=embed"
						width="100%"
						height="100%"
						style={{ border: 0 }}
						loading="lazy"
					></iframe>
				</Box>
			</Grid>

			<Grid item xs={12} sx={{ mt: { xs: 0, md: 10 } }}>
				<Box sx={{ backgroundColor: "#227e91", color: "#fff", pt: 4, pb: 4, px: 2 }}>
					<Grid container spacing={4} justifyContent="center">
						<Grid item xs={12} sm={6} md={3}>
							<Typography fontWeight="bold">Atendimento por telefone</Typography>
							<Typography display="flex" alignItems="center" marginTop={1}>
								<PhoneIcon fontSize="small" sx={{ mr: 1 }} />
								+55 (81) 99114-4483
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={3} alignItems={"center"}>
							<Typography fontWeight="bold">Atendimento por e-mail</Typography>
							<Typography display="flex" alignItems="center" marginTop={1}>
								<EmailIcon fontSize="small" sx={{ mr: 1 }} />
								<Link href="mailto:diretoria1@heliforte.com.br" color="inherit">
									diretoria1@heliforte.com.br
								</Link>
							</Typography>
							<Typography display="flex" alignItems="center" marginTop={1}>
								<EmailIcon fontSize="small" sx={{ mr: 1 }} />
								<Link href="mailto:financeiro@heliforte.com.br" color="inherit">
									financeiro@heliforte.com.br
								</Link>
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Typography fontWeight="bold">Atendimento pelo whatsapp</Typography>
							<Typography display="flex" alignItems="center" marginTop={1}>
								<WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
								+55 (81) 99114-4483
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<Typography fontWeight="bold">Onde estamos</Typography>
							<Typography display="flex" alignItems="center" marginTop={1}>
								<LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
								Av. Mal. Mascarenhas de Morais, 3000 - Imbiribeira, Recife - PE
							</Typography>
						</Grid>
					</Grid>

					<Box textAlign="center" mt={6} fontSize="0.875rem" pt={3} borderTop="1px solid rgba(255,255,255,0.2)">
						© 2025 HELIFORTE – ALL RIGHTS RESERVED.
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};

export default ContactUs;
