import PropTypes from "prop-types";
import { Button, Dialog, DialogContent, Divider, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { PopupTransition } from "components/@extended/Transitions";

export default function AlertComissary({ open, handleClose, products }) {
	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			keepMounted
			TransitionComponent={PopupTransition}
			maxWidth="sm"
			fullWidth
			aria-labelledby="column-delete-title"
			aria-describedby="column-delete-description"
		>
			<DialogContent sx={{ mt: 2, my: 1 }}>
				<Stack alignItems="start" spacing={3.5}>
					<Stack spacing={2} width={1}>
						<Typography variant="h4" align="left">
							Itens de Comissaria
						</Typography>
						<Divider />
						{products && products.length > 0 ? (
							<TableContainer>
								<Table>
									<TableBody>
										{products.map((product, index) => (
											<TableRow key={index} hover>
												<TableCell align="left">
													{product.amount}x {product.name}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Typography variant="body1" color="text.secondary" align="center">
								Nenhum produto disponível
							</Typography>
						)}
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="end" sx={{ width: 1 }}>
						<Button onClick={() => handleClose(false)} color="secondary" variant="outlined">
							Fechar
						</Button>
					</Stack>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

AlertComissary.propTypes = {
	title: PropTypes.string,
	open: PropTypes.bool,
	handleClose: PropTypes.func,
};
