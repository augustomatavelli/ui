import PropTypes from "prop-types";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { PlusOutlined } from "@ant-design/icons";

import MainCard from "components/MainCard";

const StockCard = ({ stock, unit }) => (
	<MainCard>
		<Grid container spacing={2} alignItems="center">
			<Grid item xs={12} sm={6}>
				<Stack spacing={1} alignItems={"center"}>
					<Typography variant="h5">Estoque Atual</Typography>
					<Typography variant="h3">
						{stock} {unit}
					</Typography>
				</Stack>
			</Grid>
			<Grid item xs={12} sm={6}>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="flex-end" alignItems="center">
					<Button
						variant="contained"
						startIcon={<PlusOutlined />}
						sx={{
							height: 40,
						}}
					>
						Adicionar Estoque
					</Button>
					<Button
						variant="outlined"
						startIcon={<PlusOutlined />}
						sx={{
							height: 40,
						}}
					>
						Ajuste de Estoque
					</Button>
				</Stack>
			</Grid>
		</Grid>
	</MainCard>
);

StockCard.propTypes = {
	stock: PropTypes.number,
};

export default StockCard;
