import { useContext, useState } from "react";
import { Stepper, StepLabel, Typography, Step, Grid, Stack, Button, Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import AnimateButton from "components/@extended/AnimateButton";
import ScheduleFormLanding from "./ScheduleFormLanding";
import { useNavigate } from "react-router";
import { RequestResume } from "./RequestResume";
import RequestContext from "contexts/RequestContext";
import TakeoffProductsForm from "./TakeoffProductsForm";
import OperationsForm from "./OperationsForm";
import useRequest from "hooks/useRequest";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
import ScheduleFormTakeoff from "./ScheduleFormTakeoff";

const CreateRequestStepper = ({ aircraft }) => {
	const { createRequest } = useRequest();

	const { setRequestResume, requestResume } = useContext(RequestContext);

	const [activeStep, setActiveStep] = useState(0);
	const [errorIndex, setErrorIndex] = useState(null);
	const [isFormValidFirst, setIsFormValidFirst] = useState(false);
	const [isFormValidSecond, setIsFormValidSecond] = useState(false);
	const [takeoffCheckbox, setTakeoffCheckbox] = useState(false);
	const [landingCheckbox, setLandingCheckbox] = useState(false);

	const { membership, modelo } = aircraft;

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const steps =
		membership === "S"
			? landingCheckbox
				? ["Agendamento", "Serviço de Bordo", "Serviços", "Resumo"]
				: ["Agendamento", "Serviço de Bordo", "Resumo"]
			: takeoffCheckbox
				? ["Agendamento", "Serviços", "Serviço de Bordo", "Resumo"]
				: ["Agendamento", "Serviços", "Resumo"];

	const navigate = useNavigate();

	const handleNext = () => {
		setActiveStep(activeStep + 1);
		setErrorIndex(null);
	};

	const handleBack = () => {
		if (activeStep === 0) {
			setRequestResume({});
			navigate("/aircrafts/me");
		}
		setActiveStep(activeStep - 1);
	};

	const handleFormValidation = (isValid, values) => {
		setRequestResume((prev) => ({ ...prev, ...values }));
		activeStep === 0 ? setIsFormValidFirst(isValid) : setIsFormValidSecond(isValid);
	};

	const handleCreateRequest = async () => {
		if (Array.isArray(requestResume.products)) {
			requestResume.products = requestResume.products.map((product) => ({
				...product,
				amount: String(product.amount),
			}));
		}

		const response = await createRequest(requestResume);
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
		navigate("/aircrafts/me");
	};

	return (
		<Grid sx={{ py: "20px", px: "50px" }}>
			<Stepper activeStep={activeStep} sx={{ mt: 3, mb: 5 }}>
				{steps.map((label, index) => {
					const labelProps = {};

					if (index === errorIndex) {
						labelProps.optional = (
							<Typography variant="caption" color="error">
								Error
							</Typography>
						);

						labelProps.error = true;
					}

					return (
						<Step key={label}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<Grid
				container
				spacing={isSmallScreen ? 0 : 5}
				sx={{
					display: "flex",
					justifyContent: "center",
					p: {
						xs: 1,
						sm: 2,
						md: 2.5,
					},
					alignItems: {
						xs: "center",
						sm: "center",
						md: "flex-start",
					},
					width: "100%",
				}}
			>
				<Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
					<Box
						sx={{
							width: "100%",
							height: "200px",
							borderRadius: "4px",
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<img
							src={`data:image/jpeg;base64,${aircraft.image}`}
							alt="Aircraft"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "fill",
							}}
						/>
					</Box>
					<Typography variant="h4">{aircraft.registration}</Typography>
					<Typography variant="h5">Modelo {modelo}</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					md={9}
					container
					sx={{
						flexGrow: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						width: "100%",
					}}
				>
					{membership === "S" ? (
						<>
							{activeStep === 0 && <ScheduleFormTakeoff aircraft={aircraft} onValidate={handleFormValidation} landingCheckbox={landingCheckbox} setLandingCheckbox={setLandingCheckbox} />}
							{activeStep === 1 && <TakeoffProductsForm aircraft={aircraft} onValidate={handleFormValidation} />}
							{landingCheckbox && activeStep === 2 && <OperationsForm aircraft={aircraft} onValidate={handleFormValidation} />}
							{(landingCheckbox ? activeStep === 3 : activeStep === 2) && <RequestResume aircraft={aircraft} />}
						</>
					) : (
						<>
							{activeStep === 0 && <ScheduleFormLanding aircraft={aircraft} onValidate={handleFormValidation} takeoffCheckbox={takeoffCheckbox} setTakeoffCheckbox={setTakeoffCheckbox} />}
							{activeStep === 1 && <OperationsForm aircraft={aircraft} onValidate={handleFormValidation} />}
							{takeoffCheckbox && activeStep === 2 && <TakeoffProductsForm aircraft={aircraft} onValidate={handleFormValidation} />}
							{(takeoffCheckbox ? activeStep === 3 : activeStep === 2) && <RequestResume aircraft={aircraft} />}
						</>
					)}
				</Grid>
			</Grid>
			<Divider />
			<Stack direction="row" justifyContent="space-between">
				<Button onClick={handleBack} color="error" sx={{ my: 3, ml: 1 }}>
					Voltar
				</Button>
				{activeStep <= steps.length - 1 && (
					<AnimateButton>
						{activeStep !== 3 || (!takeoffCheckbox && !landingCheckbox && activeStep !== 2) ? (
							<Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }} disabled={activeStep === 0 ? !isFormValidFirst : !isFormValidSecond}>
								Próximo
							</Button>
						) : (
							<Button variant="contained" onClick={handleCreateRequest} sx={{ my: 3, ml: 1 }}>
								Confirmar
							</Button>
						)}
					</AnimateButton>
				)}
			</Stack>
		</Grid>
	);
};

export default CreateRequestStepper;
