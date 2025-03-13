// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";

// assets
import { SearchOutlined } from "@ant-design/icons";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const SearchUser = ({ value, setValue }) => {
	const handleChange = (event) => {
		const value = event.target.value;
		value.length > 3 && setValue(value);
	};

	return (
		<Box sx={{ width: "100%", mb: 1 }}>
			<FormControl sx={{ width: { xs: "100%" } }}>
				<OutlinedInput
					size="small"
					id="header-search"
					startAdornment={
						<InputAdornment position="start">
							<SearchOutlined />
						</InputAdornment>
					}
					aria-describedby="header-search-text"
					inputProps={{
						"aria-label": "search-user",
					}}
					placeholder="Pesquisar usuário..."
					value={value}
					onChange={handleChange}
				/>
			</FormControl>
		</Box>
	);
};

export default SearchUser;
