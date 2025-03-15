import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import UserPendingTable from "sections/tables/users/UsersPending";

const UsersPending = () => {
	const { user } = useContext(UserContext);
	console.log(user);
	const navigate = useNavigate();

	//TODO: Só mostrar a página no menu lateral se o usuário for admin

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A") {
			navigate("/aircrafts/me");
		}
	}, []);

	return (
		<>
			<UserPendingTable />
		</>
	);
};

export default UsersPending;
