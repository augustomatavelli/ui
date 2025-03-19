import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import AircraftsTable from "sections/tables/aircrafts";

// ==============================|| TAB - PERSONAL ||============================== //

const ListAircraftsForAdmin = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate;

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Aeronaves" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<AircraftsTable />
		</MainCard>
	);
};

export default ListAircraftsForAdmin;
