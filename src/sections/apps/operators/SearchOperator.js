import { useContext, useState } from "react";

// material-ui
import { Box, FormControl, Button, OutlinedInput } from "@mui/material";

// assets
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import AircraftContext from "contexts/AircraftContext";
import { useTheme } from "@emotion/react";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const SearchOperator = () => {
	const { setSearchOperatorAircraftLink } = useContext(AircraftContext);

	const [inputValue, setInputValue] = useState("");
	const [hover, setHover] = useState(false);

	const theme = useTheme();

	const handleChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleClick = (event) => {
		event.preventDefault();
		const searchValue = inputValue.trim();
		setSearchOperatorAircraftLink(searchValue);
	};

	return (
		<Box sx={{ width: "100%", mb: 1 }}>
			<FormControl component="form" onSubmit={handleClick} sx={{ display: "flex", flexDirection: "row", gap: 1, width: "100%" }}>
				<OutlinedInput
					size="small"
					id="header-search"
					fullWidth
					endAdornment={
						<CloseCircleOutlined
							style={{
								cursor: "pointer",
								fontSize: 15,
								color: hover ? theme.palette.error.main : "inherit",
							}}
							onClick={() => {
								setSearchOperatorAircraftLink("");
								setInputValue("");
							}}
							onMouseEnter={() => setHover(true)}
							onMouseLeave={() => setHover(false)}
						/>
					}
					aria-describedby="header-search-text"
					placeholder="Pesquisar operador..."
					value={inputValue}
					onChange={handleChange}
					sx={{
						height: 40,
						paddingY: 0,
					}}
				/>
				<Button variant="contained" type="submit" sx={{ height: 40 }}>
					<SearchOutlined style={{ fontSize: 18 }} />
				</Button>
			</FormControl>
		</Box>
	);
};

export default SearchOperator;
