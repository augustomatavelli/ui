import { useState } from "react";

// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput, useTheme } from "@mui/material";

// assets
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const SearchRequestByAdmin = ({ setSearch }) => {
	const [inputValue, setInputValue] = useState("");
	const [hover, setHover] = useState(false);

	const theme = useTheme();

	const handleChange = (event) => {
		const value = event.target.value;
		setInputValue(value);
		(value.length > 3 || value.length === 0) && setSearch(value);
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
					endAdornment={
						<CloseCircleOutlined
							style={{
								cursor: "pointer",
								fontSize: 15,
								color: hover ? theme.palette.error.main : "inherit",
							}}
							onClick={() => {
								setSearch("");
								setInputValue("");
							}}
							onMouseEnter={() => setHover(true)}
							onMouseLeave={() => setHover(false)}
						/>
					}
					aria-describedby="header-search-text"
					inputProps={{
						"aria-label": "search-user",
					}}
					placeholder="Pesquisar solicitação..."
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

export default SearchRequestByAdmin;
