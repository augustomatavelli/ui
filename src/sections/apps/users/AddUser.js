import { useEffect, useState } from "react";
import { Button, Grid, InputLabel, Stack, FormHelperText, OutlinedInput, RadioGroup, FormControlLabel, Radio, DialogActions, Divider, DialogTitle, DialogContent } from "@mui/material";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import useUser from "hooks/useUser";
import InputMask from "react-input-mask";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DOC_TYPE, DOC_MASKS, USER_TYPE } from "constants/domain";

const getInitialValues = (user) => {
	const newUser = {
		name: "",
		email: "",
		phone: "",
		doc: "",
		pilot: "",
	};

	return newUser;
};

// ==============================|| TAB - PERSONAL ||============================== //

const AddUser = ({ user, onCancel }) => {
	const { createUserByAdmin } = useUser();

	const [typeDoc, setTypeDoc] = useState(DOC_TYPE.CPF);
	const [isPilot, setIsPilot] = useState(1);

	const NewUserSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		email: isPilot === 3 ? null : Yup.string().email("Digite um email válido").max(255).required("Email é obrigatório"),
		phone: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}$/, "Número de celular inválido")
			.required("Celular é obrigatório"),
		doc: Yup.string()
			.transform((value) => value.replace(/\D/g, ""))
			.matches(/^\d{11}(\d{3})?$/, "Número do documento inválido")
			.required("Documento é obrigatório"),
		pilot: isPilot === 1 ? Yup.string().max(255).required("Número ANAC é obrigatório") : Yup.string().max(255),
	});

	const formik = useFormik({
		initialValues: getInitialValues(user),
		validationSchema: NewUserSchema,
		onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
			const payload = {
				name: values.name,
				email: values.email,
				phone: values.phone.replace(/\D/g, ""),
				cpf: typeDoc === DOC_TYPE.CPF ? values.doc.replace(/\D/g, "") : "",
				cnpj: typeDoc === DOC_TYPE.CNPJ ? values.doc.replace(/\D/g, "") : "",
				type: isPilot === 1 ? USER_TYPE.PILOT : isPilot === 2 ? USER_TYPE.OPERATOR : USER_TYPE.COMMON,
				pilotRegister: values.pilot,
			};

			const result = await createUserByAdmin(payload);
			if (!result) {
				setSubmitting(false);
				return;
			}

			setStatus({ success: true });
			setSubmitting(false);
			dispatch(
				openSnackbar({
					open: true,
					message: "Usuário cadastrado com sucesso!",
					variant: "alert",
					alert: {
						color: "success",
					},
					close: false,
				}),
			);
			setTimeout(() => {
				resetForm();
			}, 500);
			onCancel();
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values, handleChange, handleBlur } = formik;

	useEffect(() => {
		if (isPilot === 3) {
			setFieldValue("email", "");
		}
	}, [isPilot, setFieldValue]);

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar usuário</DialogTitle>
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
													if (newTypeDoc === DOC_TYPE.CPF && isPilot !== 1) {
														setIsPilot(1);
													} else if (newTypeDoc === DOC_TYPE.CNPJ && isPilot !== 2) {
														setIsPilot(2);
													}
												}
											}}
										>
											<FormControlLabel value={DOC_TYPE.CPF} control={<Radio />} label="CPF" />
											<FormControlLabel value={DOC_TYPE.CNPJ} control={<Radio />} label="CNPJ" />
										</RadioGroup>
										<InputMask mask={typeDoc === DOC_TYPE.CPF ? DOC_MASKS.CPF : DOC_MASKS.CNPJ} value={values.doc} onChange={handleChange} onBlur={handleBlur}>
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
										<InputLabel htmlFor="firstname-signup">{typeDoc === DOC_TYPE.CPF ? "Nome completo" : "Razão social"}</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder={typeDoc === DOC_TYPE.CPF ? "Digite seu nome..." : "Digite a razão social..."}
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
								{isPilot !== 3 && (
									<Grid item xs={12}>
										<Stack spacing={1}>
											<InputLabel htmlFor="email-signup">Email</InputLabel>
											<OutlinedInput
												fullWidth
												error={Boolean(touched.email && errors.email)}
												id="email-login"
												type="email"
												value={values.email}
												name="email"
												onBlur={handleBlur}
												onChange={handleChange}
												placeholder="Digite o email..."
												inputProps={{}}
											/>
											{touched.email && errors.email && (
												<FormHelperText error id="helper-text-email-signup">
													{errors.email}
												</FormHelperText>
											)}
										</Stack>
									</Grid>
								)}
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
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="pilot-signup">Escolha o tipo de usuário</InputLabel>
										<RadioGroup
											row
											value={isPilot}
											onChange={(e) => {
												const newIsPilot = Number(e.target.value);
												if (newIsPilot !== isPilot) {
													setIsPilot(newIsPilot);
													if (newIsPilot === 2 && typeDoc !== DOC_TYPE.CNPJ) {
														setTypeDoc(DOC_TYPE.CNPJ);
													} else if ((newIsPilot === 1 || newIsPilot === 3) && typeDoc !== DOC_TYPE.CPF) {
														setTypeDoc(DOC_TYPE.CPF);
													}
												}
											}}
										>
											<FormControlLabel value={1} control={<Radio />} label="Piloto" />
											<FormControlLabel value={2} control={<Radio />} label="Operador" />
											<FormControlLabel value={3} control={<Radio />} label="Comum" />
										</RadioGroup>
										{isPilot === 1 && (
											<>
												<OutlinedInput
													fullWidth
													error={Boolean(touched.pilot && errors.pilot)}
													id="pilot-signup"
													value={values.pilot}
													name="pilot"
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder="Digite o número da ANAC..."
													inputProps={{}}
												/>
												{touched.pilot && errors.pilot && (
													<FormHelperText error id="helper-text-pilot-signup">
														{errors.pilot}
													</FormHelperText>
												)}
											</>
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

export default AddUser;
