import { memo } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Chip, Box, Tooltip, Switch, useTheme } from "@mui/material";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";

function AircraftTableRow({ aircraft, onRedirect, onApprove, onToggleMembership }) {
	const theme = useTheme();

	return (
		<TableRow
			hover
			sx={{ cursor: "pointer" }}
			onClick={() => {
				onRedirect(aircraft.id_aircraft);
			}}
		>
			<TableCell align="center">
				{aircraft.status === "P" ? (
					<Box display="flex" gap={4} justifyContent="center">
						<Tooltip title="Aprovar">
							<LikeFilled
								role="button"
								aria-label="Aprovar aeronave"
								style={{
									fontSize: 20,
									color: theme.palette.success.main,
									cursor: "pointer",
								}}
								onClick={async (event) => {
									await onApprove(event, aircraft, "S");
								}}
							/>
						</Tooltip>
						<Tooltip title="Rejeitar">
							<DislikeFilled
								role="button"
								aria-label="Rejeitar aeronave"
								style={{
									fontSize: 20,
									color: theme.palette.error.main,
									cursor: "pointer",
								}}
								onClick={async (event) => {
									await onApprove(event, aircraft, "N");
								}}
							/>
						</Tooltip>
					</Box>
				) : (
					<Chip color="success" variant="filled" size="small" label="Ativo" />
				)}
			</TableCell>
			<TableCell align="center">{aircraft.registration}</TableCell>
			<TableCell align="center">{aircraft.modelo}</TableCell>
			<TableCell align="center">
				<Box display="flex" justifyContent="center" alignItems="center">
					<Switch
						inputProps={{ "aria-label": "Alternar mensalista" }}
						checked={aircraft.membership === "S"}
						onClick={(e) => e.stopPropagation()}
						onChange={async (event) => {
							event.stopPropagation();
							await onToggleMembership(aircraft, event.target.checked);
						}}
						color="primary"
					/>
				</Box>
			</TableCell>
		</TableRow>
	);
}

AircraftTableRow.propTypes = {
	aircraft: PropTypes.object.isRequired,
	onRedirect: PropTypes.func.isRequired,
	onApprove: PropTypes.func.isRequired,
	onToggleMembership: PropTypes.func.isRequired,
};

export default memo(AircraftTableRow);
