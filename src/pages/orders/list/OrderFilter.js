import SearchOrder from "sections/apps/orders/SearchOrder";
import { Box, Stack, Chip, useMediaQuery, useTheme, Typography, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";

export const OrderFilter = ({ setSearch, selectedCategory, setSelectedCategory, categoriesArray, selectedPeriod, setSelectedPeriod, dateFilter, setDateFilter }) => {
	const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const theme = useTheme();

	const periods = [
		{ label: "Ontem", value: "yesterday" },
		{ label: "Hoje", value: "today" },
		{ label: "Próximos 7 dias", value: "next_7_days" },
		{ label: "Personalizado", value: "custom" },
	];

	return (
		<>
			<Box sx={{ display: "flex", p: 2.5, gap: 2, flexDirection: "column" }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchOrder setSearch={setSearch} />
					</Stack>
				</Stack>
				<Grid sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
					<Typography variant="subtitle1">Por categoria</Typography>
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
				</Grid>
				<Grid sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
					<Typography variant="subtitle1">Por período</Typography>
					<Grid sx={{ display: "flex", gap: 1 }}>
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
							{periods.map((e) => (
								<Chip
									key={e.value}
									label={e.label}
									color={selectedPeriod === e.value ? "primary" : "default"}
									sx={{
										fontWeight: "bold",
										color: selectedPeriod === e.value ? "white" : theme.palette.action.active,
									}}
									onClick={() => {
										setSelectedPeriod(e.value);
										setDateFilter({});
									}}
								/>
							))}
							{selectedPeriod === "custom" && (
								<>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											value={dateFilter.startDate}
											minDateTime={dayjs()}
											onChange={(e) => {
												setDateFilter((prev) => ({
													...prev,
													startDate: e,
												}));
											}}
											slotProps={{
												field: {
													format: "dd/MM/yyyy HH:mm",
													sx: {
														"& input": {
															padding: 0.75,
														},
													},
												},
											}}
										/>
									</LocalizationProvider>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<DateTimePicker
											value={dateFilter.endDate}
											minDateTime={dateFilter.startDate ? dayjs(dateFilter.startDate) : dayjs()}
											onChange={(e) => {
												if (e && dateFilter.startDate && dayjs(e).isAfter(dateFilter.startDate)) {
													setDateFilter((prev) => ({
														...prev,
														endDate: e,
													}));
												} else {
													dispatch(
														openSnackbar({
															open: true,
															message: "A data final deve ser maior que a data inicial",
															variant: "alert",
															alert: {
																color: "error",
															},
															close: true,
														})
													);
												}
											}}
											slotProps={{
												field: {
													format: "dd/MM/yyyy HH:mm",
													sx: {
														"& input": {
															padding: 0.75,
														},
													},
												},
											}}
										/>
									</LocalizationProvider>
								</>
							)}
						</Stack>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};
