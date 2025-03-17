import { useContext, useState } from "react";

// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from "@mui/material";

// assets
import { SearchOutlined } from "@ant-design/icons";
import AircraftContext from "contexts/AircraftContext";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const SearchUser = () => {
	const { setUserAircraftLink } = useContext(AircraftContext);

	const [inputValue, setInputValue] = useState("");

	const handleChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		value.length > 3 && setUserAircraftLink(value);
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
					value={inputValue}
					onChange={handleChange}
					sx={{
						height: 40,
						paddingY: 0,
					}}
				/>
			</FormControl>
		</Box>
	);
};

export default SearchUser;
