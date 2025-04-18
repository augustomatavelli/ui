import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import MyRequestsTable from "sections/tables/requests/MyRequests";
import { FilterOutlined } from "@ant-design/icons";

const ListMyRequests = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);

	useEffect(() => {
		if (!user) return;
	}, []);

	return (
		<MainCard
			content={false}
			title="Solicitações de pouso"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			secondary={
				<FilterOutlined
					onClick={() => {
						setOpenFilter(!openFilter);
					}}
					style={{ fontSize: 20 }}
				/>
			}
		>
			<MyRequestsTable openFilter={openFilter} />
		</MainCard>
	);
};

export default ListMyRequests;
