import MainCard from "components/MainCard";
import UserContext from "contexts/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";

const ListTasks = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		if (user.type !== "A" && user.type !== "C") {
			navigate("/aircrafts/me", { replace: true });
		}
	}, []);

	return <MainCard content={false} title="Tarefas" sx={{ "& .MuiInputLabel-root": { fontSize: "0.875rem" } }}></MainCard>;
};

export default ListTasks;
