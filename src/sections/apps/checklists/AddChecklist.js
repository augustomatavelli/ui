import { FieldArray, useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import { Button, Grid, InputLabel, Stack, OutlinedInput, FormHelperText, Divider, DialogActions, DialogTitle, DialogContent, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import useChecklist from "hooks/useChecklists";

const getInitialValues = () => ({
	name: "",
	itens: [""],
});

const AddChecklist = ({ onCancel }) => {
	const { createChecklist } = useChecklist();

	const validationSchema = Yup.object().shape({
		name: Yup.string().required("Nome é obrigatório"),
		itens: Yup.array().of(Yup.string().required("Item não pode estar vazio")).min(1, "É obrigatório adicionar pelo menos um item"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				const payload = {
					name: values.name,
					itens: values.itens,
				};
				await createChecklist(payload);
				resetForm();
				onCancel();
			} catch (err) {
				console.error(err);
			} finally {
				setSubmitting(false);
			}
		},
	});

	const { values, errors, touched, handleSubmit, handleChange, handleBlur, isSubmitting } = formik;

	return (
		<FormikProvider value={formik}>
			<Form onSubmit={handleSubmit}>
				<DialogTitle>Criar checklist</DialogTitle>
				<Divider />
				<DialogContent sx={{ p: 2.5 }}>
					<Grid container spacing={3}>
						{/* Input Name */}
						<Grid item xs={12}>
							<Stack spacing={1}>
								<InputLabel htmlFor="name">Nome</InputLabel>
								<OutlinedInput
									id="name"
									name="name"
									value={values.name}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Digite o nome do checklist..."
									fullWidth
									error={Boolean(touched.name && errors.name)}
								/>
								{touched.name && errors.name && <FormHelperText error>{errors.name}</FormHelperText>}
							</Stack>
						</Grid>

						{/* FieldArray de Itens */}
						<Grid item xs={12}>
							<FieldArray name="itens">
								{({ push, remove }) => (
									<Stack spacing={2}>
										{values.itens.map((item, index) => (
											<Stack key={index} direction="row" spacing={1} alignItems="center">
												<OutlinedInput
													name={`itens[${index}]`}
													value={item}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder={`Item ${index + 1}`}
													fullWidth
													error={Boolean(touched.itens?.[index] && errors.itens?.[index])}
												/>
												<IconButton
													onClick={() => remove(index)}
													size="small"
													color="error"
													disabled={values.itens.length === 1}
													sx={{
														border: 1,
														borderColor: values.itens.length === 1 ? "" : "error.main",
														backgroundColor: "transparent",
														"&:hover": {
															backgroundColor: "error.main",
															color: "white",
														},
													}}
												>
													<RemoveIcon />
												</IconButton>
											</Stack>
										))}
										<Button type="button" onClick={() => push("")}>
											Adicionar Item
										</Button>
										{typeof errors.itens === "string" && <FormHelperText error>{errors.itens}</FormHelperText>}
									</Stack>
								)}
							</FieldArray>
						</Grid>
					</Grid>
				</DialogContent>
				<Divider />
				<DialogActions sx={{ p: 2.5 }}>
					<Button color="error" onClick={onCancel}>
						Fechar
					</Button>
					<Button type="submit" variant="contained" disabled={isSubmitting}>
						Criar
					</Button>
				</DialogActions>
			</Form>
		</FormikProvider>
	);
};

export default AddChecklist;
