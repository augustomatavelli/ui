import { Box, Stack, Chip, useTheme, Typography, Grid } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";

export const RequestFilter = ({ selectedStatus, setSelectedStatus, selectedPeriod, setSelectedPeriod, dateFilter, setDateFilter }) => {
	const theme = useTheme();

	const requestStatus = ["A", "F", "C"];
	const periods = [
		{ label: "Últimos 7 dias", value: "last_7_days" },
		{ label: "Ontem", value: "yesterday" },
		{ label: "Hoje", value: "today" },
		{ label: "Próximos 7 dias", value: "next_7_days" },
		{ label: "Personalizado", value: "custom" },
	];

	return (
		<Box sx={{ display: "flex", px: 2.5, mb: 2.5, gap: 5 }}>
			<Grid sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
				<Typography variant="subtitle1">Por status</Typography>
				{requestStatus.length > 0 && (
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
						{requestStatus.map((e) => (
							<Chip
								key={e}
								label={e === "A" ? "Em aberto" : e === "F" ? "Finalizado" : "Cancelado"}
								color={selectedStatus[e] ? "primary" : "default"}
								sx={{ fontWeight: "bold", color: selectedStatus[e] ? "white" : theme.palette.action.active }}
								onClick={() => {
									setSelectedStatus((prev) => {
										const newSelected = { ...prev };
										if (newSelected[e]) {
											delete newSelected[e];
										} else {
											newSelected[e] = true;
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
	);
};
