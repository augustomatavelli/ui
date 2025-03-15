import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import AircraftPendingTable from "sections/tables/aircrafts/AircraftsPending";

const AricraftsPending = () => {
	const { user } = useContext(UserContext);

	const navigate = useNavigate();
	//TODO: Só mostrar a página no menu lateral se o usuário for admin

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, [user]);

	return (
		<>
			<AircraftPendingTable />
		</>
	);
};

export default AricraftsPending;
