import PropTypes from "prop-types";

// material-ui
import { Button, DialogActions, DialogTitle, Divider, Grid, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import AddLinkUserAircraftTable from "sections/tables/aircrafts/AddLinkUserAircraft";

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddLinkUserAircraft = ({ setOpen }) => {
	const AddUserAircraftSchema = Yup.object().shape({
		rab: Yup.string().max(255).required("RAB é obrigatório"),
	});

	const formik = useFormik({
		validationSchema: AddUserAircraftSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			/* 	try {
					const response = await createAircraft(newHelicopter);
				if (response) {
					dispatch(
						openSnackbar({
							open: true,
							message: response.message,
							variant: "alert",
							alert: {
								color: "success",
							},
							close: false,
						})
					);
					setStatus({ success: true });
					setSubmitting(false);
					setOpen(false);
				}
			} catch (error) {
				console.error(error);
			} */
		},
	});

	const { handleSubmit } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Adicionar vínculo</DialogTitle>
						<Divider />
						<Grid spacing={1}>
							<AddLinkUserAircraftTable />
						</Grid>
						<Divider />
						<DialogActions sx={{ p: 2.5 }}>
							<Grid container justifyContent="flex-end" alignItems="center">
								<Grid item>
									<Stack direction="row" spacing={2} alignItems="center">
										<Button
											color="error"
											onClick={() => {
												setOpen(false);
											}}
										>
											Fechar
										</Button>
									</Stack>
								</Grid>
							</Grid>
						</DialogActions>
					</Form>
				</LocalizationProvider>
			</FormikProvider>
		</>
	);
};

AddLinkUserAircraft.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddLinkUserAircraft;
