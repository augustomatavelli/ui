// material-ui
import { Grid, Card, CardContent, Typography, TextField, IconButton, Box } from "@mui/material";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";

export const ProductsList = ({ searchProducts, requestObject, handleAddProduct, handleChangeProductAmount, handleRemoveProduct }) => {
	return searchProducts.map((e) => (
		<Card key={e.id_product} sx={{ minWidth: 200, marginRight: "1rem" }}>
			<CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, maxWidth: "25%" }}>
					<Box
						sx={{
							width: "100%",
							height: "50px",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#f0f0f0",
						}}
					>
						<img
							src={`data:image/jpeg;base64,${e.image}`}
							alt="Product"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "fill",
							}}
						/>
					</Box>
					<Typography variant="subtitle1">{e.name}</Typography>
				</Grid>
				<Grid sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<IconButton onClick={() => handleRemoveProduct(e.id_product, e.name)} color="error" sx={{ mt: 1, fontSize: 20 }}>
						<MinusCircleFilled />
					</IconButton>
					<TextField
						type="number"
						value={requestObject.products && requestObject.products.length > 0 ? (requestObject.products.find((p) => p.id_product === e.id_product)?.amount ?? "") : ""}
						onChange={(el) => {
							const rawValue = el.target.value;
							const newValue = rawValue === "" ? "" : Math.max(0, Number(rawValue));
							handleChangeProductAmount(e.id_product, newValue);
						}}
						inputProps={{ min: 0 }}
						size="small"
						sx={{ width: 80, mt: 1 }}
					/>
					<IconButton onClick={() => handleAddProduct(e.id_product, e.name)} color="success" sx={{ mt: 1, fontSize: 20 }}>
						<PlusCircleFilled />
					</IconButton>
				</Grid>
			</CardContent>
		</Card>
	));
};
