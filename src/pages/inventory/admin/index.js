import MainCard from "components/MainCard";
import { useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import StockCard from "components/cards/inventory/StockCard";
import InventoryMovementsTable from "sections/tables/inventory";

const InventoryAdmin = () => {
	const [service, setService] = useState("");

	const handleServiceChange = (event) => {
		setService(event.target.value);
	};

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="service-select-label">Serviço</InputLabel>
					<Select labelId="service-select-label" id="service-select" value={service} label="Serviço" onChange={handleServiceChange}>
						<MenuItem value={10}>Serviço 1</MenuItem>
						<MenuItem value={20}>Serviço 2</MenuItem>
						<MenuItem value={30}>Serviço 3</MenuItem>
					</Select>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<StockCard stock={95} unit={"L"} />
			</Grid>
			<Grid item xs={12}>
				<MainCard content={false} title="Movimentações de Estoque" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
					<InventoryMovementsTable />
				</MainCard>
			</Grid>
		</Grid>
	);
};

export default InventoryAdmin;
