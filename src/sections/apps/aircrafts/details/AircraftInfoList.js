import PropTypes from "prop-types";
import { Grid, ListItem, Stack, Typography, Divider } from "@mui/material";

const InfoRow = ({ label, value }) => (
	<>
		<ListItem>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Stack spacing={0.5}>
						<Typography color="secondary">{label}</Typography>
						<Typography>{value}</Typography>
					</Stack>
				</Grid>
			</Grid>
		</ListItem>
		<Divider />
	</>
);

InfoRow.propTypes = {
	label: PropTypes.node,
	value: PropTypes.node,
};

const AircraftInfoList = ({ registration, modelo, status, membership }) => {
	return (
		<>
			<InfoRow label="Matrícula" value={registration} />
			<InfoRow label="Modelo" value={modelo} />
			<InfoRow label="Situação" value={status === "A" ? "Ativo" : status === "P" ? "Pendente" : "Inativo"} />
			<InfoRow label="Mensalista" value={membership === "S" ? "Sim" : "Não"} />
		</>
	);
};

AircraftInfoList.propTypes = {
	registration: PropTypes.string,
	modelo: PropTypes.string,
	status: PropTypes.string,
	membership: PropTypes.string,
};

export default AircraftInfoList;
