import { memo } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Chip } from "@mui/material";

function OperationTableRow({ operation, onRedirect }) {
	const e = operation;

	return (
		<TableRow
			hover
			sx={{ cursor: "pointer" }}
			onClick={() => {
				onRedirect(e.id_service);
			}}
		>
			<TableCell align="center">
				<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_service}`} />
			</TableCell>
			<TableCell align="center">{e.name}</TableCell>
			<TableCell align="center">
				<Chip color="warning" variant="filled" size="small" label={e.category_name} sx={{ color: "#252525" }} />
			</TableCell>
			<TableCell align="center">
				{new Intl.NumberFormat("pt-BR", {
					style: "currency",
					currency: "BRL",
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(e.price)}
			</TableCell>
			<TableCell align="center">{e.unit}</TableCell>
			<TableCell align="center">
				<Chip color={e.status === "D" ? "success" : "error"} variant="filled" size="small" label={e.status === "D" ? "Disponível" : "Indisponível"} />
			</TableCell>
			<TableCell align="center">{e.created_by}</TableCell>
		</TableRow>
	);
}

OperationTableRow.propTypes = {
	operation: PropTypes.object.isRequired,
	onRedirect: PropTypes.func.isRequired,
};

export default memo(OperationTableRow);
