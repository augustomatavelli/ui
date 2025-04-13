import { Chip } from "@mui/material";

export const CategoryChip = ({ label, categoryId, selectedCategory, setSelectedCategory }) => (
	<Chip
		label={label}
		variant={label === "Todos" ? (Object.keys(selectedCategory).length === 0 ? "filled" : "outlined") : selectedCategory[categoryId] ? "filled" : "outlined"}
		onClick={() => {
			if (label === "Todos") {
				setSelectedCategory({});
			} else {
				setSelectedCategory((prev) => {
					const newSelected = { ...prev };
					if (newSelected[categoryId]) {
						delete newSelected[categoryId];
					} else {
						newSelected[categoryId] = true;
					}
					return newSelected;
				});
			}
		}}
		sx={{ cursor: "pointer" }}
	/>
);
