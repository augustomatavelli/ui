import PropTypes from "prop-types";

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// third-party.png
import _ from "lodash";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import AddLinkUserHelicopterTable from "sections/tables/helicopters/AddLinkUserHelicopter";
import useHelicopter from "hooks/useHelicopter";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";

// ==============================|| CUSTOMER ADD / EDIT / DELETE ||============================== //

const AddLinkUserHelicopter = ({ setOpen }) => {
	const { addLinkUserHelicopter } = useHelicopter();

	const handleAddLinkUserHelicopter = async (userId, helicopterId) => {
		const payload = { userId: userId, helicopterId: helicopterId };

		const response = await addLinkUserHelicopter(payload);
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
		window.history.back();
	};

	const AddUserHelicopterSchema = Yup.object().shape({
		rab: Yup.string().max(255).required("RAB é obrigatório"),
	});

	const formik = useFormik({
		validationSchema: AddUserHelicopterSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus }) => {
			/* 	try {
					const response = await createHelicopter(newHelicopter);
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

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Adicionar vínculo</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<AddLinkUserHelicopterTable />
							</Grid>
						</DialogContent>
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
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Vncular
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

AddLinkUserHelicopter.propTypes = {
	helicopter: PropTypes.any,
	onCancel: PropTypes.func,
};

export default AddLinkUserHelicopter;
