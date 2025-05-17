import PropTypes from "prop-types";
import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";
import { LocationOn, Flight, Warehouse, EventSeat, Groups, DoorFront, LocalGasStation, BuildCircle } from "@mui/icons-material";
import LogoHeliforte from "../../../assets/images/LogoHeliforte.svg";

export default function AlertLandingSiteInfo({ open, handleClose }) {
	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="sm"
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Box display="flex" alignItems="center" mb={2} justifyContent="center">
					<img src={LogoHeliforte} alt="Logo" width="150" height="40" />
				</Box>

				<Typography paragraph>
					Seja bem-vindo à <strong>Heliforte</strong>, o primeiro helicentro de Pernambuco! Pensado para quem valoriza eficiência, cuidado e uma estrutura de alto padrão, estamos prontos para oferecer
					a melhor experiência no setor aéreo executivo.
				</Typography>
				<Box display="flex" alignItems="center" mb={1}>
					<LocationOn sx={{ mr: 1, color: "#1976d2" }} />
					<Typography>Localização privilegiada: Av. Marechal Mascarenhas de Moraes, 403 – Imbiribeira, Recife.</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<Flight sx={{ mr: 1, color: "#0288d1" }} />
					<Typography>
						Heliponto homologado <strong>SN9F</strong> e operação segura.
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<Warehouse sx={{ mr: 1, color: "#6d4c41" }} />
					<Typography>
						Estrutura com <strong>6.000 m²</strong> de área total e hangar de <strong>1.100 m²</strong>, com capacidade para até <strong>20 aeronaves</strong>.
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<EventSeat sx={{ mr: 1, color: "#8e24aa" }} />
					<Typography>
						<strong>2 salas VIP</strong> climatizadas e confortáveis para o seu descanso.
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<Groups sx={{ mr: 1, color: "#3949ab" }} />
					<Typography>Sala de reunião equipada, ideal para encontros rápidos e estratégicos.</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<DoorFront sx={{ mr: 1, color: "#43a047" }} />
					<Typography>
						Mais de <strong>12 salas privativas</strong> e recepção exclusiva para seu conforto e privacidade.
					</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<LocalGasStation sx={{ mr: 1, color: "#f57c00" }} />
					<Typography>Ponto de abastecimento disponível para mais praticidade na sua operação.</Typography>
				</Box>
				<Box display="flex" alignItems="center" mb={1}>
					<BuildCircle sx={{ mr: 1, color: "#d32f2f" }} />
					<Typography>Oficina mecânica parceira com estrutura segura para manutenção e suporte técnico.</Typography>
				</Box>
				<Typography paragraph mt={2}>
					Na Heliforte, você encontra tudo o que precisa em um só lugar para voar com tranquilidade, eficiência e excelência. <strong>Estamos prontos para receber você e sua aeronave!</strong>
				</Typography>
			</DialogContent>
		</Dialog>
	);
}

AlertLandingSiteInfo.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
