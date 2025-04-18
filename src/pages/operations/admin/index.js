import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import OperationsTable from "sections/tables/operations";
import { FilterOutlined } from "@ant-design/icons";

const ListOperationsForAdmin = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Serviços"
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
			<OperationsTable openFilter={openFilter} />
		</MainCard>
	);
};

export default ListOperationsForAdmin;
