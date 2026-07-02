import PropTypes from "prop-types";
import { Grid, ListItem, Stack, Typography, Divider, IconButton } from "@mui/material";
import { EditOutlined } from "@ant-design/icons";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fromDisplay, toApi, now } from "utils/date";

const RequestDateEditor = ({ label, field, dateValue, status, isEditing, onToggleEdit, onChangeDate, showError = true }) => {
	return (
		<>
			<ListItem>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Stack spacing={1}>
							<Stack direction="row" alignItems="center" spacing={1.5}>
								<Typography color="secondary">{label}</Typography>
								{status === "A" && (
									<IconButton
										size="small"
										onClick={() => {
											onToggleEdit(field);
										}}
									>
										<EditOutlined />
									</IconButton>
								)}
							</Stack>
							{isEditing ? (
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DateTimePicker
										value={dateValue ? fromDisplay(dateValue) : null}
										disablePast
										minDateTime={now()}
										onChange={(e) => {
											onChangeDate(e);
										}}
										slotProps={showError ? { field: { format: "dd/MM/yyyy HH:mm" }, textField: { error: false } } : { field: { format: "dd/MM/yyyy HH:mm" } }}
									/>
								</LocalizationProvider>
							) : (
								<Typography>{dateValue ? dateValue : "Não agendado"}</Typography>
							)}
						</Stack>
					</Grid>
				</Grid>
			</ListItem>
			<Divider />
		</>
	);
};

RequestDateEditor.propTypes = {
	label: PropTypes.string,
	field: PropTypes.string,
	dateValue: PropTypes.string,
	status: PropTypes.string,
	isEditing: PropTypes.bool,
	onToggleEdit: PropTypes.func,
	onChangeDate: PropTypes.func,
	showError: PropTypes.bool,
};

export { toApi };
export default RequestDateEditor;
