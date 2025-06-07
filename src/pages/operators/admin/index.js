import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FilterOutlined } from "@ant-design/icons";
import OperatorsTable from "sections/tables/operators";

const ListOperatorsForAdmin = () => {
	const { user } = useContext(UserContext);

	const [openFilter, setOpenFilter] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "S") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard
			content={false}
			title="Operadores"
			sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}
			/* secondary={
				<FilterOutlined
					onClick={() => {
						setOpenFilter(!openFilter);
					}}
					style={{ fontSize: 20 }}
				/>
			} */
		>
			<OperatorsTable openFilter={openFilter} />
		</MainCard>
	);
};

export default ListOperatorsForAdmin;
