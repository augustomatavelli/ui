import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import RequestsTable from "sections/tables/requests";

// ==============================|| TAB - PERSONAL ||============================== //

const ListRequestsForAdmin = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Solicitações de pouso" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<RequestsTable />
		</MainCard>
	);
};

export default ListRequestsForAdmin;
