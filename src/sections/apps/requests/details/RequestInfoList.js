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

const RequestInfoList = ({ id_request, landing_site, registration, user_name, created_at }) => {
	return (
		<>
			<InfoRow label="Número da solicitação" value={`#${id_request}`} />
			<InfoRow label="Helicentro" value={landing_site} />
			<InfoRow label="Matrícula" value={registration} />
		</>
	);
};

RequestInfoList.propTypes = {
	id_request: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	landing_site: PropTypes.string,
	registration: PropTypes.string,
	user_name: PropTypes.string,
	created_at: PropTypes.string,
};

export { InfoRow };
export default RequestInfoList;
