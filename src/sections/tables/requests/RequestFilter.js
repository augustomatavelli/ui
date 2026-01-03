import { Box, Stack, Chip, useTheme, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { openSnackbar } from "store/reducers/snackbar";
import { dispatch } from "store";

export const RequestFilter = ({ selectedStatus, setSelectedStatus, selectedPeriod, setSelectedPeriod, dateFilter, setDateFilter }) => {
	const theme = useTheme();

	const requestStatus = ["A", "F", "C", "AB"];
	const periods = [
		{ label: "Últimos 7 dias", value: "last_7_days" },
		{ label: "Ontem", value: "yesterday" },
		{ label: "Hoje", value: "today" },
		{ label: "Próximos 7 dias", value: "next_7_days" },
		{ label: "Personalizado", value: "custom" },
	];

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
						Status
					</Typography>
					<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
						{requestStatus.map((e) => (
							<Chip
								key={e}
								label={e === "A" ? "Em aberto" : e === "F" ? "Finalizado" : e === "C" ? "Cancelado" : "Ausente"}
								size="small"
								color={selectedStatus[e] ? "primary" : "default"}
								variant={selectedStatus[e] ? "filled" : "outlined"}
								sx={{
									fontWeight: 500,
									fontSize: "0.8125rem",
									height: 28,
									cursor: "pointer",
									transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									"&:hover": {
										transform: "translateY(-1px)",
										boxShadow: selectedStatus[e] ? 2 : 1,
									},
								}}
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
	);
};
