import { useContext, useState } from "react";
import {
	Button,
	Grid,
	InputLabel,
	Stack,
	FormHelperText,
	OutlinedInput,
	RadioGroup,
	FormControlLabel,
	Radio,
	DialogActions,
	Divider,
	DialogTitle,
	DialogContent,
	IconButton,
	Box,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import useScriptRef from "hooks/useScriptRef";
import InputMask from "react-input-mask";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useOperator from "hooks/useOperator";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import OperatorContext from "contexts/OperatorContext";

const getInitialValues = () => {
	const newOperator = {
		name: "",
		email0: "",
		email1: "",
		email2: "",
		email3: "",
		email4: "",
		email5: "",
		email6: "",
		email7: "",
		phone: "",
		doc: "",
		social: "",
	};

	return newOperator;
};

const AddOperator = ({ onCancel }) => {
	const { createOperator } = useOperator();

	const { loadingOperator } = useContext(OperatorContext);

	const scriptedRef = useScriptRef();

	const [typeDoc, setTypeDoc] = useState("cpf");
	const [emailFields, setEmailFields] = useState([0]);

	const addEmailField = () => {
		if (emailFields.length < 8) {
			setEmailFields([...emailFields, emailFields.length]);
		}
	};

	const removeEmailField = (indexToRemove) => {
		if (emailFields.length > 1) {
			setEmailFields(emailFields.filter((_, index) => index !== indexToRemove));
			setFieldValue(`email${indexToRemove}`, "");
		}
	};

	const NewOperatorSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		email0: Yup.string().email("E-mail deve ser válido").max(255).required("E-mail é obrigatório"),
		email1: Yup.string().email("E-mail deve ser válido").max(255),
		email2: Yup.string().email("E-mail deve ser válido").max(255),
		email3: Yup.string().email("E-mail deve ser válido").max(255),
		email4: Yup.string().email("E-mail deve ser válido").max(255),
		email5: Yup.string().email("E-mail deve ser válido").max(255),
		email6: Yup.string().email("E-mail deve ser válido").max(255),
		email7: Yup.string().email("E-mail deve ser válido").max(255),
		phone: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}$/, "Número de celular inválido")
			.required("Celular é obrigatório"),
		doc: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}(\d{3})?$/, "Número do documento inválido")
			.required("Documento é obrigatório"),
		social: Yup.string().max(255).required("Razão social é obrigatória"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: NewOperatorSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
			try {
				const payload = {
					name: values.name,
					email0: values.email0,
					email1: values.email1,
					email2: values.email2,
					email3: values.email3,
					email4: values.email4,
					email5: values.email5,
					email6: values.email6,
					email7: values.email7,
					phone: values.phone.replace(/\D/g, ""),
					cpf: typeDoc === "cpf" ? values.doc.replace(/\D/g, "") : "",
					cnpj: typeDoc === "cnpj" ? values.doc.replace(/\D/g, "") : "",
					social: values.social,
				};

				const response = await createOperator(payload);
				if (scriptedRef.current) {
					setStatus({ success: true });
					setSubmitting(false);
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
					setTimeout(() => {
						resetForm();
					}, 500);
					onCancel();
				}
			} catch (err) {
				setErrors({});
				console.error(err);
				const message =
					err.response.status === 409 ? "Operador já existe!" : err.response.status === 400 ? "Erro ao cadastrar operador! Confira se os dados estão corretos!" : "Erro ao cadastrar operador!";
				if (scriptedRef.current) {
					setStatus({ success: false });
					setErrors({ submit: message });
					setSubmitting(false);
				}
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar operador</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="doc-signup">Documento</InputLabel>
										<RadioGroup
											row
											value={typeDoc}
											onChange={(e) => {
												const newTypeDoc = e.target.value;
												if (newTypeDoc !== typeDoc) {
													setTypeDoc(newTypeDoc);
												}
											}}
										>
											<FormControlLabel value="cpf" control={<Radio />} label="CPF" />
											<FormControlLabel value="cnpj" control={<Radio />} label="CNPJ" />
										</RadioGroup>
										<InputMask mask={typeDoc === "cpf" ? "999.999.999-99" : "99.999.999/9999-99"} value={values.doc} onChange={handleChange} onBlur={handleBlur}>
											{() => <OutlinedInput fullWidth error={Boolean(touched.doc && errors.doc)} id="doc-signup" name="doc" placeholder="Digite o número do documento..." />}
										</InputMask>
										{touched.doc && errors.doc && (
											<FormHelperText error id="helper-text-doc-signup">
												{errors.doc}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="firstname-signup">{typeDoc === "cpf" ? "Nome completo" : "Razão social"}</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder={typeDoc === "cpf" ? "Digite o nome..." : "Digite a razão social..."}
											fullWidth
											error={Boolean(touched.name && errors.name)}
										/>
										{touched.name && errors.name && (
											<FormHelperText error id="helper-text-name-signup">
												{errors.name}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="social-signup">Razão social</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.social && errors.social)}
											id="social-login"
											type="social"
											value={values.social}
											name="social"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder="Digite a razão social..."
											inputProps={{}}
										/>
										{touched.social && errors.social && (
											<FormHelperText error id="helper-text-social-signup">
												{errors.social}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Box display="flex" alignItems="center" justifyContent="space-between">
											<InputLabel htmlFor="email-signup">E-mail</InputLabel>
											<IconButton
												onClick={addEmailField}
												disabled={emailFields.length >= 8 || loadingOperator}
												size="small"
												color="primary"
												sx={{
													border: 1,
													borderColor: "primary.main",
													backgroundColor: "transparent",
													"&:hover": {
														backgroundColor: "primary.main",
														color: "white",
													},
												}}
											>
												<AddIcon />
											</IconButton>
										</Box>
										{emailFields.map((fieldIndex, arrayIndex) => (
											<Box key={fieldIndex} display="flex" alignItems="center" gap={1}>
												<OutlinedInput
													fullWidth
													id={`email${fieldIndex}-signup`}
													type="email"
													value={values[`email${fieldIndex}`] || ""}
													name={`email${fieldIndex}`}
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder="Digite o e-mail..."
													error={Boolean(touched[`email${fieldIndex}`] && errors[`email${fieldIndex}`])}
												/>
												{emailFields.length > 1 && (
													<IconButton
														onClick={() => removeEmailField(arrayIndex)}
														size="small"
														color="error"
														disabled={loadingOperator}
														sx={{
															border: 1,
															borderColor: "error.main",
															backgroundColor: "transparent",
															"&:hover": {
																backgroundColor: "error.main",
																color: "white",
															},
														}}
													>
														<RemoveIcon />
													</IconButton>
												)}
											</Box>
										))}

										{emailFields.map(
											(fieldIndex) =>
												touched[`email${fieldIndex}`] &&
												errors[`email${fieldIndex}`] && (
													<FormHelperText key={`error-${fieldIndex}`} error id={`helper-text-email${fieldIndex}-signup`}>
														{errors[`email${fieldIndex}`]}
													</FormHelperText>
												)
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="phone-signup">Celular</InputLabel>
										<InputMask mask={"(99) 99999-9999"} value={values.phone} onChange={handleChange} onBlur={handleBlur}>
											{() => <OutlinedInput fullWidth error={Boolean(touched.phone && errors.phone)} id="phone-signup" name="phone" placeholder="Digite o número do celular..." />}
										</InputMask>
										{touched.phone && errors.phone && (
											<FormHelperText error id="helper-text-phone-signup">
												{errors.phone}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
							</Grid>
						</DialogContent>
						{errors.submit && (
							<Grid item xs={12}>
								<FormHelperText error>{errors.submit}</FormHelperText>
							</Grid>
						)}
						<Divider />
						<DialogActions sx={{ p: 2.5 }}>
							<Grid container justifyContent="flex-end" alignItems="center">
								<Grid item>
									<Stack direction="row" spacing={2} alignItems="center">
										<Button color="error" onClick={onCancel}>
											Fechar
										</Button>
										<Button type="submit" variant="contained" disabled={isSubmitting}>
											Criar
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

export default AddOperator;
