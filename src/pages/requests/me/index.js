import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import MyRequestsTable from "sections/tables/requests/MyRequests";

// ==============================|| TAB - PERSONAL ||============================== //

const ListMyRequests = () => {
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<MainCard content={false} title="Solicitações de pouso" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<MyRequestsTable />
		</MainCard>
	);
};

export default ListMyRequests;
