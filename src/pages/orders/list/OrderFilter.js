import SearchOrder from "sections/apps/orders/SearchOrder";
import { Box, Stack, Chip, useMediaQuery } from "@mui/material";
import { CategoryChip } from "./OrderCategoryChip";

export const OrderFilter = ({ setSearch, selectedCategory, setSelectedCategory, categoriesArray }) => {
	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<>
			<Box sx={{ display: "flex", p: 2.5, gap: 2, flexDirection: "column" }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchOrder setSearch={setSearch} />
					</Stack>
				</Stack>
				{categoriesArray.length > 0 && (
					<Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
						<Chip
							label={"Todos"}
							variant={Object.keys(selectedCategory).length === 0 ? "filled" : "outlined"}
							onClick={() => {
								setSelectedCategory({});
							}}
							sx={{ cursor: "pointer" }}
						/>
						{categoriesArray.map((e) => {
							return <CategoryChip key={e.id_category} label={e.name} categoryId={e.id_category} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
						})}
					</Stack>
				)}
			</Box>
		</>
	);
};
