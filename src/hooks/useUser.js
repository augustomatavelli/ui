import { useContext } from "react";
import UseAxios from "./useAxios";
import UserContext from "contexts/UserContext";

const useUser = () => {
	const { publicAxios } = UseAxios();
	const { setUser } = useContext(UserContext);

	const findOneUser = async () => {
		const response = await publicAxios.get("/users");
		setUser(response.data);
	};

	return { findOneUser };
};

export default useUser;
