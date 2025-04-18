import SearchOrder from "sections/apps/orders/SearchOrder";
import { Box, Stack, Chip, useMediaQuery, useTheme } from "@mui/material";

export const OrderFilter = ({ setSearch, selectedCategory, setSelectedCategory, categoriesArray }) => {
	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const theme = useTheme();

	return (
		<>
			<Box sx={{ display: "flex", p: 2.5, gap: 2, flexDirection: "column" }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchOrder setSearch={setSearch} />
					</Stack>
				</Stack>
				{categoriesArray.length > 0 && (
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
						<Chip
							key={"Todos"}
							label={"Todos"}
							color={Object.keys(selectedCategory).length === 0 ? "primary" : "default"}
							sx={{ fontWeight: "bold", color: Object.keys(selectedCategory).length === 0 ? "white" : theme.palette.action.active }}
							onClick={() => {
								setSelectedCategory({});
							}}
						/>
						{categoriesArray.map((e) => (
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
		</>
	);
};

{
	/* <ButtonGroup variant="contained" sx={{ width: "fit-content" }}>
						<Button
							onClick={() => {
								setSelectedCategory({});
							}}
							variant={Object.keys(selectedCategory).length === 0 ? "contained" : "outlined"}
						>
							Todos
						</Button>
						{categoriesArray.map((e) => (
							<Button
								key={e.id_category}
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
								variant={selectedCategory[e.id_category] ? "contained" : "outlined"}
							>
								{e.name}
							</Button>
						))}
					</ButtonGroup> */
}
