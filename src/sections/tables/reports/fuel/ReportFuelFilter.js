import { Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, endOfYear, subDays, isAfter } from "date-fns";

export const ReportFuelFilter = ({ selectedPeriod, setSelectedPeriod, dateFilter, setDateFilter }) => {
	const theme = useTheme();

	const periods = [
		{ label: "Geral", value: "general" },
		{ label: "Mês atual", value: "current_month" },
		{ label: "Últimos 7 dias", value: "last_7_days" },
		{ label: "Ontem", value: "yesterday" },
		{ label: "Hoje", value: "today" },
		{ label: "Personalizado", value: "custom" },
	];

	const handleChangePeriod = (value) => {
		setSelectedPeriod(value);

		const today = new Date();
		let startDate = null;
		let endDate = null;

		switch (value) {
			case "general":
				startDate = new Date("2025-01-01T00:00:00");
				endDate = endOfYear(today);
				break;
			case "current_month":
				startDate = startOfMonth(today);
				endDate = endOfMonth(today);
				break;
			case "last_7_days":
				startDate = startOfDay(subDays(today, 7));
				endDate = endOfDay(today);
				break;
			case "yesterday":
				startDate = startOfDay(subDays(today, 1));
				endDate = endOfDay(subDays(today, 1));
				break;
			case "today":
				startDate = startOfDay(today);
				endDate = endOfDay(today);
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
									handleChangePeriod(e.value);
								}}
							/>
						))}
						{selectedPeriod === "custom" && (
							<>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										value={dateFilter.start}
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
										onChange={(e) => {
											if (e && dateFilter.start && isAfter(e, new Date(dateFilter.start))) {
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
				</Stack>
			</Stack>
		</Box>
	);
};
