import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import MyAircraftsRequestsTable from "sections/tables/requests/MyAircraftsRequest";

// ==============================|| TAB - PERSONAL ||============================== //

const ListRequestsOfMyAircrafts = () => {
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<MainCard content={false} title="Solicitações de pouso" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<MyAircraftsRequestsTable />
		</MainCard>
	);
};

export default ListRequestsOfMyAircrafts;
