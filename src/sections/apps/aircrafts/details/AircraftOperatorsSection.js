import PropTypes from "prop-types";
import { memo, useState } from "react";
import { Grid, ListItem, Stack, Typography, Divider, Button, Chip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ConfirmDialog from "components/feedback/ConfirmDialog";

const AircraftOperatorsSection = ({ operators, user, id, onAddOperator, onDeleteOperator }) => {
	const isAdmin = user.type === "S" || user.type === "A";

	const [operatorToUnlink, setOperatorToUnlink] = useState(null);
	const [unlinking, setUnlinking] = useState(false);

	const handleConfirmUnlink = async () => {
		if (!operatorToUnlink) return;
		setUnlinking(true);
		try {
			await onDeleteOperator(operatorToUnlink.id_operator, id);
		} finally {
			setUnlinking(false);
			setOperatorToUnlink(null);
		}
	};

	return (
		<>
			<ListItem>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Stack spacing={1}>
							<Grid container alignItems="center" spacing={2}>
								<Grid item>
									<Typography color="secondary">Operadores</Typography>
								</Grid>
								{isAdmin && (
									<Grid item>
										<Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={onAddOperator} size="small">
											Adicionar
										</Button>
									</Grid>
								)}
							</Grid>
							{!operators || operators.length === 0 ? (
								<Typography>Nenhum operador vinculado à aeronave.</Typography>
							) : (
								<Stack direction="row" spacing={1}>
									{operators.map((operator) => {
										return isAdmin ? (
											<Chip
												key={operator.id_operator}
												label={operator.name}
												sx={{ width: "fit-content" }}
												onDelete={() => setOperatorToUnlink(operator)}
											/>
										) : (
											<Chip key={operator.id_operator} label={operator.name} sx={{ width: "fit-content" }} />
										);
									})}
								</Stack>
							)}
						</Stack>
					</Grid>
				</Grid>
			</ListItem>
			<Divider />
			<ConfirmDialog
				open={operatorToUnlink !== null}
				title="Desvincular operador"
				description={operatorToUnlink ? `Tem certeza que deseja desvincular o operador ${operatorToUnlink.name} desta aeronave?` : ""}
				confirmText="Desvincular"
				loading={unlinking}
				onClose={() => setOperatorToUnlink(null)}
				onConfirm={handleConfirmUnlink}
			/>
		</>
	);
};

AircraftOperatorsSection.propTypes = {
	operators: PropTypes.array,
	user: PropTypes.object,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onAddOperator: PropTypes.func,
	onDeleteOperator: PropTypes.func,
};

export default memo(AircraftOperatorsSection);
