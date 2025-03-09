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

	const updatePassword = async (data) => {
		try {
			await publicAxios.patch("/users", data);
		} catch (error) {
			console.log(error);
		}
	};

	return { findOneUser, updatePassword };
};

export default useUser;
