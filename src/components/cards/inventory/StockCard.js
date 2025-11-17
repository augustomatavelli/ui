import PropTypes from "prop-types";
import { Grid, Stack, Typography } from "@mui/material";

import MainCard from "components/MainCard";

const StockCard = ({ stock, unit }) => (
	<MainCard>
		<Grid container spacing={2} alignItems="center">
			<Grid item xs={4}>
				<Stack spacing={1} alignItems="center">
					<Typography variant="h5">Estoque Atual</Typography>
					<Typography variant="h3">
						{stock} {unit}
					</Typography>
				</Stack>
			</Grid>
		</Grid>
	</MainCard>
);

StockCard.propTypes = {
	stock: PropTypes.number,
};

export default StockCard;
