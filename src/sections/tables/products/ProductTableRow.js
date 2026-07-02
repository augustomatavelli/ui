import { memo } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Chip, Tooltip, IconButton } from "@mui/material";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

function ProductTableRow({ product, onRedirect, onToggleVisibility }) {
	const e = product;

	return (
		<TableRow
			hover
			sx={{ cursor: "pointer" }}
			onClick={() => {
				onRedirect(e.id_product);
			}}
		>
			<TableCell align="center">
				<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_product}`} />
			</TableCell>
			<TableCell align="center">{e.name}</TableCell>
			<TableCell align="center">
				<Chip color="warning" variant="filled" size="small" label={e.category_name} sx={{ color: "#252525" }} />
			</TableCell>
			<TableCell align="center">
				<>
					{new Intl.NumberFormat("pt-BR", {
						style: "currency",
						currency: "BRL",
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}).format(e.price)}{" "}
					<Tooltip title={e.hide_price === "S" ? "Mostrar" : "Esconder"}>
						<IconButton
							aria-label={e.hide_price === "S" ? "Mostrar preço" : "Esconder preço"}
							onClick={(event) => {
								event.stopPropagation();
								onToggleVisibility(e.id_product, e.hide_price);
							}}
							edge="end"
							color={e.hide_price === "S" ? "error" : "success"}
						>
							{e.hide_price === "S" ? <EyeInvisibleOutlined style={{ fontSize: 20, fontWeight: "bold" }} /> : <EyeOutlined style={{ fontSize: 20, fontWeight: "bold" }} />}
						</IconButton>
					</Tooltip>
				</>
			</TableCell>
			<TableCell align="center">{e.unit}</TableCell>
			<TableCell align="center">
				<Chip color={e.status === "D" ? "success" : "error"} variant="filled" size="small" label={e.status === "D" ? "Disponível" : "Indisponível"} />
			</TableCell>
			<TableCell align="center">{e.created_by}</TableCell>
		</TableRow>
	);
}

ProductTableRow.propTypes = {
	product: PropTypes.object.isRequired,
	onRedirect: PropTypes.func.isRequired,
	onToggleVisibility: PropTypes.func.isRequired,
};

export default memo(ProductTableRow);
