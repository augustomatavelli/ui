import { Box, Stack, Chip, useMediaQuery, useTheme, Typography } from "@mui/material";
import ProductsContext from "contexts/ProductsContext";
import { useContext } from "react";

export const ProductFilter = ({ selectedCategory, setSelectedCategory }) => {
	const { categories } = useContext(ProductsContext);

	const theme = useTheme();

	return (
		<Box sx={{ display: "flex", px: 2.5, mb: 2.5, gap: 1, flexDirection: "column" }}>
			<Typography variant="subtitle1">Por categoria</Typography>
			{categories.length > 0 && (
				<Stack
					direction="row"
					spacing={1}
					sx={{
						overflowX: "auto",
						whiteSpace: "nowrap",
						scrollbarWidth: "thin",
						"&::-webkit-scrollbar": {
							height: "6px",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: "#ccc",
							borderRadius: "4px",
						},
					}}
				>
					{categories.map((e) => (
						<Chip
							key={e.id_category}
							label={e.name}
							color={selectedCategory[e.id_category] ? "primary" : "default"}
							sx={{ fontWeight: "bold", color: selectedCategory[e.id_category] ? "white" : theme.palette.action.active }}
							onClick={() => {
								setSelectedCategory((prev) => {
									const newSelected = { ...prev };
									if (newSelected[e.id_category]) {
										delete newSelected[e.id_category];
									} else {
										newSelected[e.id_category] = true;
									}
									return newSelected;
								});
							}}
						/>
					))}
				</Stack>
			)}
		</Box>
	);
};
