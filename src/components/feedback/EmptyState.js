import PropTypes from "prop-types";

// material-ui
import { Box, Stack, Typography } from "@mui/material";

// assets
import { InboxOutlined } from "@ant-design/icons";

// ==============================|| FEEDBACK - EMPTY STATE ||============================== //

/**
 * Estado vazio reutilizável para listas/tabelas sem resultados.
 */
export default function EmptyState({ title = "Nenhum resultado encontrado", description, icon, action }) {
	return (
		<Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ py: 6, px: 2, width: 1 }}>
			<Box sx={{ fontSize: 40, color: "text.disabled", lineHeight: 1 }}>{icon || <InboxOutlined />}</Box>
			<Typography variant="h5" color="text.secondary" align="center">
				{title}
			</Typography>
			{description && (
				<Typography variant="body2" color="text.disabled" align="center">
					{description}
				</Typography>
			)}
			{action}
		</Stack>
	);
}

EmptyState.propTypes = {
	title: PropTypes.node,
	description: PropTypes.node,
	icon: PropTypes.node,
	action: PropTypes.node,
};
