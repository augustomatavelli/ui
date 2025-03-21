import { useState } from "react";
import { Stepper, StepLabel, Typography, Step, Grid, Stack, Button, Divider } from "@mui/material";
import AnimateButton from "components/@extended/AnimateButton";
import MainCard from "components/MainCard";

const CreateRequestStepper = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [errorIndex, setErrorIndex] = useState(null);

	const steps = ["Agendamento", "Produtos e Serviços", "Resumo"];

	const handleNext = () => {
		setActiveStep(activeStep + 1);
		setErrorIndex(null);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	return (
		<MainCard title="Solicitar pouso">
			<Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
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
			{activeStep === 0 && <Grid>Passo 1</Grid>}
			{activeStep === 1 && <Grid>Passo 2</Grid>}
			{activeStep === 2 && <Grid>Passo 3</Grid>}
			<Stack direction="row" justifyContent={activeStep !== 0 ? "space-between" : "flex-end"}>
				{activeStep !== 0 && (
					<Button onClick={handleBack} sx={{ my: 3, ml: 1 }}>
						Back
					</Button>
				)}
				{activeStep < steps.length - 1 && (
					<AnimateButton>
						<Button variant="contained" onClick={handleNext} sx={{ my: 3, ml: 1 }}>
							Next
						</Button>
					</AnimateButton>
				)}
			</Stack>
		</MainCard>
	);
};

export default CreateRequestStepper;
