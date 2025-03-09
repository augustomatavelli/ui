import PropTypes from "prop-types";
// material-ui
import { Box, Grid, Stack, Typography } from "@mui/material";

// ==============================|| EMPTY STATE ||============================== //

const EmptyUserCard = ({ title }) => {
	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Box
					sx={{
						p: { xs: 2.5, sm: 6 },
						height: "50vh",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						bgcolor: "transparent",
					}}
				>
					<Grid container direction="column" justifyContent="center" alignItems="center">
						<Stack spacing={1}>
							<Typography align="center" variant="h4">
								{title}
							</Typography>
						</Stack>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
};

EmptyUserCard.propTypes = {
	title: PropTypes.string,
};

export default EmptyUserCard;
