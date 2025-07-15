import { Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const ReportFuelFilter = ({ selectedPeriod, setSelectedPeriod, dateFilter, setDateFilter }) => {
	const theme = useTheme();

	const periods = [
		{ label: "Mês atual", value: "current_month" },
		{ label: "Últimos 7 dias", value: "last_7_days" },
		{ label: "Ontem", value: "yesterday" },
		{ label: "Hoje", value: "today" },
		{ label: "Personalizado", value: "custom" },
	];

	const handleChangePeriod = (value) => {
		setSelectedPeriod(value);

		const today = dayjs().tz("America/Sao_Paulo");
		let startDate = null;
		let endDate = null;

		switch (value) {
			case "current_month":
				startDate = today.startOf("month");
				endDate = today.endOf("month");
				break;
			case "last_7_days":
				startDate = today.subtract(7, "day").startOf("day");
				endDate = today.endOf("day");
				break;
			case "yesterday":
				startDate = today.subtract(1, "day").startOf("day");
				endDate = today.subtract(1, "day").endOf("day");
				break;
			case "today":
				startDate = today.startOf("day");
				endDate = today.endOf("day");
				break;
			default:
				break;
		}

		if (startDate && endDate) {
			setDateFilter({
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			});
		} else {
			setDateFilter({});
		}
	};

	return (
		<Box sx={{ display: "flex", px: 2.5, my: 2.5, gap: 5 }}>
			<Grid sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
				<Typography variant="subtitle1">Por data</Typography>
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
									handleChangePeriod(e.value);
								}}
							/>
						))}
						{selectedPeriod === "custom" && (
							<>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										value={dateFilter.start}
										minDateTime={dayjs()}
										onChange={(e) => {
											setDateFilter((prev) => ({
												...prev,
												start: e,
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
										value={dateFilter.end}
										minDateTime={dateFilter.start ? dayjs(dateFilter.start) : dayjs()}
										onChange={(e) => {
											if (e && dateFilter.start && dayjs(e).isAfter(dateFilter.start)) {
												setDateFilter((prev) => ({
													...prev,
													end: e,
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
