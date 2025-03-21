import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import OperationsTable from "sections/tables/operations";

// ==============================|| TAB - PERSONAL ||============================== //

const ListOperationsForAdmin = () => {
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
			<OperationsTable />
		</MainCard>
	);
};

export default ListOperationsForAdmin;
