import MainCard from "components/MainCard";
import AircraftContext from "contexts/AircraftContext";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import CreateRequestStepper from "sections/apps/requests";

// ==============================|| TAB - PERSONAL ||============================== //

const CreateRequest = () => {
	const { user } = useContext(UserContext);
	const { requestAircraft } = useContext(AircraftContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (Object.keys(requestAircraft).length === 0) {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Criar solicitação" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<CreateRequestStepper aircraft={requestAircraft} />
		</MainCard>
	);
};

export default CreateRequest;
