import { useContext, useState } from "react";
import { Stepper, StepLabel, Typography, Step, Grid, Stack, Button, Box, Divider } from "@mui/material";
import AnimateButton from "components/@extended/AnimateButton";
import ScheduleForm from "./ScheduleForm";
import { useNavigate } from "react-router";
import ProductsOperationsForm from "./ProductsOperationsForm";
import { RequestResume } from "./RequestResume";
import RequestContext from "contexts/RequestContext";

const CreateRequestStepper = ({ aircraft }) => {
	const { setRequestResume } = useContext(RequestContext);

	const [activeStep, setActiveStep] = useState(0);
	const [errorIndex, setErrorIndex] = useState(null);
	const [isFormValidFirst, setIsFormValidFirst] = useState(false);
	const [isFormValidSecond, setIsFormValidSecond] = useState(false);

	const steps = ["Agendamento", "Produtos e Serviços", "Resumo"];

	const navigate = useNavigate();

	const handleNext = () => {
		setActiveStep(activeStep + 1);
		setErrorIndex(null);
	};

	const handleBack = () => {
		if (activeStep === 0) {
			navigate("/aircrafts/me");
		}
		setActiveStep(activeStep - 1);
	};

	const handleFormValidation = (isValid, values) => {
		setRequestResume((prev) => ({ ...prev, ...values }));
		activeStep === 0 ? setIsFormValidFirst(isValid) : setIsFormValidSecond(isValid);
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
			<Grid container spacing={3} sx={{ alignItems: "flex-start", display: "flex", justifyContent: "space-between", p: 2.5 }}>
				<Grid item xs={12} md={3} sx={{ alignItems: "center", display: "flex", flexDirection: "column", gap: 2 }}>
					<Box
						sx={{
							width: "100%",
							height: "250px",
							borderRadius: "50%",
							overflow: "hidden",
							border: "2px solid #ccc",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#f0f0f0",
						}}
					>
						<img
							src={`data:image/jpeg;base64,${aircraft.image}`}
							alt="Helicopter"
							style={{
								width: "100%",
								height: "100%",
								objectFit: "fill",
							}}
						/>
					</Box>

					<Typography variant="h4">{aircraft.rab}</Typography>
					<Typography variant="h5">Categoria {aircraft.category}</Typography>
				</Grid>
				<Grid item xs={12} md={8} sx={{ alignItems: "center", display: "flex", justifyContent: "flex-end", width: "75%" }}>
					{activeStep === 0 && <ScheduleForm aircraft={aircraft} onValidate={handleFormValidation} />}
					{activeStep === 1 && <ProductsOperationsForm aircraft={aircraft} onValidate={handleFormValidation} />}
					{activeStep === 2 && <RequestResume aircraft={aircraft} />}
				</Grid>
			</Grid>
			<Divider />
			<Stack direction="row" justifyContent="space-between">
				<Button onClick={handleBack} color="error" sx={{ my: 3, ml: 1 }}>
					Voltar
				</Button>
				{activeStep < steps.length - 1 && (
					<AnimateButton>
						<Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }} disabled={activeStep === 0 ? !isFormValidFirst : !isFormValidSecond}>
							Próximo
						</Button>
					</AnimateButton>
				)}
			</Stack>
		</Grid>
	);
};

export default CreateRequestStepper;
