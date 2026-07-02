import PropTypes from "prop-types";

// material-ui
import { Skeleton, TableCell, TableRow } from "@mui/material";

// ==============================|| FEEDBACK - TABLE SKELETON ||============================== //

/**
 * Linhas de skeleton para exibir enquanto uma tabela carrega.
 * Renderiza `rows` x `columns` células com animação.
 */
export default function TableSkeleton({ rows = 5, columns = 5 }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<TableRow key={`skeleton-row-${rowIndex}`}>
					{Array.from({ length: columns }).map((__, colIndex) => (
						<TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
							<Skeleton animation="wave" height={24} />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}

TableSkeleton.propTypes = {
	rows: PropTypes.number,
	columns: PropTypes.number,
};
