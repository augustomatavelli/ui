import { memo } from "react";
import PropTypes from "prop-types";
import { TableRow, TableCell, Chip, Button, Grid } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";

function RequestTableRow({ request, onRedirect, onFinalize }) {
	const e = request;

	return (
		<TableRow
			hover
			sx={{ cursor: "pointer" }}
			onClick={() => {
				onRedirect(e.id_request);
			}}
		>
			<TableCell align="center">
				<Chip color="secondary" variant="filled" size="small" label={`# ${e.id_request}`} />
			</TableCell>
			<TableCell align="center">
				{e.status === "A" && (
					<Button
						variant="contained"
						size="small"
						onClick={(event) => {
							event.stopPropagation();
							onFinalize(e.id_request);
						}}
					>
						Finalizar
					</Button>
				)}
			</TableCell>
			<TableCell align="center">{e.user}</TableCell>
			<TableCell align="center">{e.registration}</TableCell>
			<TableCell align="center">{e.name}</TableCell>
			<TableCell>
				{e.landing_date ? (
					<Grid
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Grid style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
							<EventIcon fontSize="inherit" style={{ marginRight: 4 }} />
							{e.landing_date}
						</Grid>
						{e.landing_time && (
							<Grid style={{ display: "flex", alignItems: "center", color: "green", marginTop: 2 }}>
								<CheckCircleIcon fontSize="inherit" style={{ marginRight: 4 }} />
								{e.landing_time}
							</Grid>
						)}
					</Grid>
				) : (
					<Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>-</Grid>
				)}
			</TableCell>
			<TableCell>
				{e.takeoff_date ? (
					<Grid
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Grid style={{ display: "flex", alignItems: "center", fontWeight: 500 }}>
							<EventIcon fontSize="inherit" style={{ marginRight: 4 }} />
							{e.takeoff_date}
						</Grid>
						{e.takeoff_time && (
							<Grid style={{ display: "flex", alignItems: "center", color: "green", marginTop: 2 }}>
								<CheckCircleIcon fontSize="inherit" style={{ marginRight: 4 }} />
								{e.takeoff_time}
							</Grid>
						)}
					</Grid>
				) : (
					<Grid style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}>-</Grid>
				)}
			</TableCell>
			<TableCell align="center">
				<Chip
					color={e.absence === "S" ? "warning" : e.status === "A" ? "primary" : e.status === "P" ? "warning" : e.status === "F" ? "success" : e.status === "C" ? "error" : "error"}
					variant="filled"
					size="small"
					label={
						e.absence === "S"
							? "Ausente"
							: e.status === "A"
								? "Em aberto"
								: e.status === "P"
									? "Pendente"
									: e.status === "F"
										? "Finalizado"
										: e.status === "C"
											? "Cancelado"
											: "Rejeitado"
					}
					sx={{ color: e.status === "P" || e.absence === "S" ? "#252525" : "white" }}
				/>
			</TableCell>
			<TableCell align="center">{e.created_at}</TableCell>
		</TableRow>
	);
}

RequestTableRow.propTypes = {
	request: PropTypes.object.isRequired,
	onRedirect: PropTypes.func.isRequired,
	onFinalize: PropTypes.func.isRequired,
};

export default memo(RequestTableRow);
