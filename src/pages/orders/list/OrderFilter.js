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
			<Box sx={{ p: 2.5 }}>
				<Stack direction="row" alignItems="center">
					<Stack direction={matchDownSM ? "column" : "row"} sx={{ width: "100%" }} spacing={1} justifyContent="space-between" alignItems="center">
						<SearchOrder setSearch={setSearch} />
					</Stack>
				</Stack>
			</Box>
			<Box
				sx={{
					mx: 2.5,
					mb: 2.5,
					py: 2,
					px: 2.5,
					backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
					borderRadius: 1.5,
					border: `1px solid ${theme.palette.divider}`,
				}}
			>
				<Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
					<Stack spacing={1} sx={{ minWidth: 180 }}>
						<Typography
							variant="body2"
							sx={{
								fontWeight: 600,
								color: theme.palette.text.secondary,
								fontSize: "0.8125rem",
								textTransform: "uppercase",
								letterSpacing: 0.5,
							}}
						>
							Categoria
						</Typography>
						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							<Chip
								key={"Todos"}
								label={"Todos"}
								size="small"
								color={Object.keys(selectedCategory).length === 0 ? "primary" : "default"}
								variant={Object.keys(selectedCategory).length === 0 ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: Object.keys(selectedCategory).length === 0 ? 2 : 1,
									},
								}}
								onClick={() => {
									setSelectedCategory({});
								}}
							/>
							{categoriesArray.map((e) => (
								<Chip
									key={e.id_category}
									label={e.name}
									size="small"
									color={selectedCategory[e.id_category] ? "primary" : "default"}
									variant={selectedCategory[e.id_category] ? "filled" : "outlined"}
									sx={{
										fontWeight: 500,
										fontSize: "0.8125rem",
										height: 28,
										cursor: "pointer",
										transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
										"&:hover": {
											transform: "translateY(-1px)",
											boxShadow: selectedCategory[e.id_category] ? 2 : 1,
										},
									}}
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
					</Stack>

					<Stack spacing={1} sx={{ minWidth: 180, flex: 1 }}>
						<Typography
							variant="body2"
							sx={{
								fontWeight: 600,
								color: theme.palette.text.secondary,
								fontSize: "0.8125rem",
								textTransform: "uppercase",
								letterSpacing: 0.5,
							}}
						>
							Período
						</Typography>
						<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
							{periods.map((e) => (
								<Chip
									key={e.value}
									label={e.label}
									size="small"
									color={selectedPeriod === e.value ? "primary" : "default"}
									variant={selectedPeriod === e.value ? "filled" : "outlined"}
									sx={{
										fontWeight: 500,
										fontSize: "0.8125rem",
										height: 28,
										cursor: "pointer",
										transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
										"&:hover": {
											transform: "translateY(-1px)",
											boxShadow: selectedPeriod === e.value ? 2 : 1,
										},
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
					</Stack>
				</Stack>
			</Box>
		</>
	);
};
