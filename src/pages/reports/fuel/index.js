import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import ReportFuelTable from "sections/tables/reports";

const ReportFuelPeriod = () => {
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Relatório Combustível" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<ReportFuelTable />
		</MainCard>
	);
};

export default ReportFuelPeriod;
