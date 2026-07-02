import PropTypes from "prop-types";
import { Chip } from "@mui/material";

const RequestStatusChip = ({ status, absence }) => {
	return (
		<Chip
			color={absence === "S" ? "warning" : status === "A" ? "primary" : status === "F" ? "success" : status === "P" ? "warning" : status === "C" ? "error" : "error"}
			variant="filled"
			size="medium"
			label={absence === "S" ? "Ausente" : status === "A" ? "Em aberto" : status === "P" ? "Pendente" : status === "F" ? "Finalizado" : status === "C" ? "Cancelado" : "Rejeitado"}
			sx={{ fontWeight: "bold", color: status === "P" || absence === "S" ? "#252525" : "white" }}
		/>
	);
};

RequestStatusChip.propTypes = {
	status: PropTypes.string,
	absence: PropTypes.string,
};

export default RequestStatusChip;
