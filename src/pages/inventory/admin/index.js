import MainCard from "components/MainCard";
import { useContext, useEffect, useState } from "react";
import { Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import StockCard from "components/cards/inventory/StockCard";
import InventoryMovementsTable from "sections/tables/inventory";
import { PlusOutlined } from "@ant-design/icons";
import useInventory from "hooks/useInventory";
import InventoryContext from "contexts/InventoryContext";
import Loader from "components/Loader";
import AlertStockIn from "sections/apps/inventory/AlertStockIn";
import AlertStockAdjust from "sections/apps/inventory/AlertStockAdjust";

const InventoryAdmin = () => {
	const { findAllInventory, findAllInventoryList } = useInventory();

	const { loadingInventory, inventoryList, actualStock } = useContext(InventoryContext);

	const [service, setService] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [typeFilter, setTypeFilter] = useState("Todos");
	const [openIn, setOpenIn] = useState(false);
	const [openAdjust, setOpenAdjust] = useState(false);

	const handleServiceChange = (event) => {
		setService(event.target.value);
	};

	const handleTypeChange = (event) => {
		setTypeFilter(event.target.value);
	};

	const handleClose = () => {
		setOpenIn(false);
		setOpenAdjust(false);
	};

	useEffect(() => {
		findAllInventoryList();
	}, []);

	useEffect(() => {
		service && findAllInventory(service, search, page, typeFilter);
	}, [search, page, service, typeFilter, openIn, openAdjust]);

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<FormControl fullWidth>
					<InputLabel id="service-select-label">Item</InputLabel>
					<Select labelId="service-select-label" id="service-select" value={service} label="Item" onChange={handleServiceChange}>
						{inventoryList.length > 0 &&
							inventoryList.map((item) => (
								<MenuItem key={`${item.id}_${item.type}`} value={`${item.id}_${item.type}`}>
									{item.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</Grid>
			{loadingInventory ? (
				<Loader />
			) : (
				service && (
					<>
						<Grid item xs={12}>
							<StockCard stock={actualStock} unit={"L"} />
						</Grid>
						<Grid item xs={12}>
							<MainCard
								content={false}
								title="Movimentações de Estoque"
								sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
								secondary={
									<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<FormControl>
											<InputLabel id="type-select-label">Tipo</InputLabel>
											<Select labelId="type-select-label" id="type-select" value={typeFilter} label="Item" onChange={handleTypeChange}>
												{["Todos", "Entrada", "Saída", "Ajuste"].map((item) => (
													<MenuItem key={item} value={item}>
														{item}
													</MenuItem>
												))}
											</Select>
										</FormControl>
										<Button
											variant="contained"
											startIcon={<PlusOutlined />}
											sx={{
												minWidth: 50,
												width: "fit-content",
												px: 2,
												py: 1,
											}}
											onClick={() => {
												setOpenIn(true);
											}}
										>
											Entrada
										</Button>
										<Button
											variant="contained"
											color="error"
											startIcon={<PlusOutlined />}
											sx={{
												minWidth: 50,
												width: "fit-content",
												px: 2,
												py: 1,
											}}
											onClick={() => {
												setOpenAdjust(true);
											}}
										>
											Ajuste
										</Button>
									</Grid>
								}
							>
								<InventoryMovementsTable setSearch={setSearch} page={page} setPage={setPage} service={service} search={search} typeFilter={typeFilter} />
							</MainCard>
						</Grid>
					</>
				)
			)}
			<AlertStockIn open={openIn} handleClose={handleClose} service={service} />
			<AlertStockAdjust open={openAdjust} handleClose={handleClose} service={service} />
		</Grid>
	);
};

export default InventoryAdmin;
