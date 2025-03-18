import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import UsersTable from "sections/tables/users";

// ==============================|| TAB - PERSONAL ||============================== //

const ListUsersForAdmin = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<MainCard content={false} title="Usuários" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}>
			<UsersTable />
		</MainCard>
	);
};

export default ListUsersForAdmin;
