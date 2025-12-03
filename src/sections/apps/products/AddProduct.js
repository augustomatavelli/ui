import { useContext, useEffect, useState } from "react";
import {
	Button,
	Grid,
	InputLabel,
	Stack,
	FormHelperText,
	OutlinedInput,
	DialogActions,
	Divider,
	DialogTitle,
	DialogContent,
	Select,
	MenuItem,
	Typography,
	useTheme,
	TextField,
	Box,
	Avatar,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import useScriptRef from "hooks/useScriptRef";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ProductsContext from "contexts/ProductsContext";
import useProduct from "hooks/useProduct";
import { CameraOutlined } from "@ant-design/icons";

const getInitialValues = () => {
	const newProduct = {
		name: "",
		price: "",
		unit: "",
		category: "",
		available_at: "A",
		stock: "N",
		image: "",
	};

	return newProduct;
};

const AddProduct = ({ onCancel }) => {
	const { createProduct, findCategories } = useProduct();

	const { categories } = useContext(ProductsContext);

	const [selectedImage, setSelectedImage] = useState(undefined);
	const [avatar, setAvatar] = useState();
	const [available, setAvailable] = useState("A");
	const [stock, setStock] = useState("N");

	const scriptedRef = useScriptRef();

	const theme = useTheme();

	const units = ["g", "kg", "L", "un", "pacote", "fardo", "lata", "garrafa"];

	async function readFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target.result.split(",")[1]);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	const handleChangeAvailable = (event) => {
		setAvailable(event.target.value);
	};

	const handleChangeStock = (event) => {
		setStock(event.target.value);
	};

	useEffect(() => {
		findCategories();
	}, []);

	useEffect(() => {
		if (selectedImage) {
			setAvatar(URL.createObjectURL(selectedImage));
		}
	}, [selectedImage]);

	const NewProductSchema = Yup.object().shape({
		name: Yup.string().max(255).required("Nome é obrigatório"),
		price: Yup.string().max(255).required("Preço é obrigatório"),
		unit: Yup.string().max(255).required("Unidade é obrigatória"),
		category: Yup.string().max(255).required("Categoria é obrigatória"),
	});

	const formik = useFormik({
		initialValues: getInitialValues(),
		validationSchema: NewProductSchema,
		onSubmit: async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
			try {
				const { name, price, unit, category } = values;
				let base64Image = "";
				base64Image = await readFile(selectedImage);
				const payload = {
					name: name,
					price: parseFloat(price.replace(",", ".")).toFixed(1),
					unit: unit,
					id_category: Number(category),
					available_at: available,
					inventory: stock,
					image: selectedImage ? base64Image : "",
				};
				const response = await createProduct(payload);
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
					err.response.status === 409 ? "Produto já existe!" : err.response.status === 400 ? "Erro ao cadastrar produto! Confira se os dados estão corretos!" : "Erro ao cadastrar produto!";
				if (scriptedRef.current) {
					setStatus({ success: false });
					setErrors({ submit: message });
					setSubmitting(false);
				}
			}
		},
	});

	const { errors, touched, handleSubmit, isSubmitting, values, handleChange, handleBlur } = formik;

	return (
		<>
			<FormikProvider value={formik}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
						<DialogTitle>Criar produto</DialogTitle>
						<Divider />
						<DialogContent sx={{ p: 2.5 }}>
							<Grid container spacing={3}>
								<Grid item xs={12} md={3}>
									<Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
										<FormLabel
											htmlFor="change-avtar"
											sx={{
												position: "relative",
												borderRadius: "50%",
												overflow: "hidden",
												"&:hover .MuiBox-root": { opacity: 1 },
												cursor: "pointer",
											}}
										>
											<Avatar alt="Avatar 1" src={avatar} sx={{ width: 144, height: 144, border: "1px dashed" }}>
												{!avatar && (
													<Stack spacing={0.5} alignItems="center">
														<CameraOutlined style={{ color: theme.palette.secondary.light, fontSize: "2rem" }} />
														<Typography sx={{ color: "secondary.lighter" }}>Carregar imagem</Typography>
													</Stack>
												)}
											</Avatar>
											<Box
												sx={{
													position: "absolute",
													top: 0,
													left: 0,
													backgroundColor: "rgba(0,0,0,.25)",
													width: "100%",
													height: "100%",
													opacity: 0,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											/>
										</FormLabel>
										<TextField
											type="file"
											id="change-avtar"
											placeholder="Outlined"
											variant="outlined"
											sx={{ display: "none" }}
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													const validFormats = ["image/png", "image/jpeg"];
													const maxSize = 2 * 1024 * 1024; // 2MB

													if (!validFormats.includes(file.type)) {
														dispatch(
															openSnackbar({
																open: true,
																message: "Formato inválido! Apenas PNG e JPEG são permitidos",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															})
														);
														return;
													}

													if (file.size > maxSize) {
														dispatch(
															openSnackbar({
																open: true,
																message: "O tamanho máximo permitido é 2MB",
																variant: "alert",
																alert: {
																	color: "warning",
																},
																close: false,
															})
														);
														return;
													}

													setSelectedImage(file);
												}
											}}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12} md={8}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="firstname-signup">Nome</InputLabel>
												<OutlinedInput
													id="name-login"
													type="name"
													value={values.name}
													name="name"
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder="Digite o nome..."
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
												<InputLabel htmlFor="category">Categoria</InputLabel>
												<Select
													value={values.category}
													name="category"
													onChange={handleChange}
													displayEmpty
													inputProps={{ "aria-label": "Without label" }}
													renderValue={values.category ? undefined : () => <Typography variant="subtitle1">Selecione uma categoria</Typography>}
												>
													{categories.map((e) => {
														return (
															<MenuItem key={e.id_category} value={e.id_category}>
																{e.name}
															</MenuItem>
														);
													})}
												</Select>
												{touched.category && errors.category && (
													<FormHelperText error id="helper-text-category-signup">
														{errors.category}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="price">Preço</InputLabel>
												<OutlinedInput
													id="price"
													type="text"
													value={values.price}
													name="price"
													onBlur={handleBlur}
													onChange={handleChange}
													placeholder="Digite o preço..."
													fullWidth
													error={Boolean(touched.price && errors.price)}
												/>
												{touched.price && errors.price && (
													<FormHelperText error id="helper-text-price-signup">
														{errors.price}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="unit">Unidade de medida</InputLabel>
												<Select
													value={values.unit}
													name="unit"
													onChange={handleChange}
													displayEmpty
													inputProps={{ "aria-label": "Without label" }}
													renderValue={values.unit ? undefined : () => <Typography variant="subtitle1">Selecione uma unidade de medida</Typography>}
												>
													{units.map((e) => {
														return <MenuItem value={e}>{e}</MenuItem>;
													})}
												</Select>
												{touched.unit && errors.unit && (
													<FormHelperText error id="helper-text-unit-signup">
														{errors.unit}
													</FormHelperText>
												)}
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<InputLabel htmlFor="unit">Disponibilidade do produto</InputLabel>
												<RadioGroup aria-label="size" value={available} defaultValue="available" name="radio-buttons-group" onChange={handleChangeAvailable} row>
													<FormControlLabel value="P" control={<Radio />} label="No pouso" />
													<FormControlLabel value="D" control={<Radio />} label="Na decolagem" />
													<FormControlLabel value="A" control={<Radio />} label="Ambos" />
												</RadioGroup>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack spacing={1}>
												<Grid display="flex" alignItems="center" gap={1}>
													<InputLabel htmlFor="unit">Controle de estoque?</InputLabel>
												</Grid>
												<RadioGroup aria-label="size" value={stock} defaultValue="N" name="radio-buttons-group" onChange={handleChangeStock} row>
													<FormControlLabel value="S" control={<Radio />} label="Sim" />
													<FormControlLabel value="N" control={<Radio />} label="Não" />
												</RadioGroup>
											</Stack>
										</Grid>
									</Grid>
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

export default AddProduct;
