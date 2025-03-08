import { useContext } from "react";
import UseAxios from "./useAxios";
import HelicopterContext from "contexts/HelicopterContext";

const useHelicopter = () => {
	const { publicAxios } = UseAxios();
	const { setHelicopters } = useContext(HelicopterContext);

	const createHelicopter = async (data) => {
		try {
			await publicAxios.post("/helicopters", data);
		} catch (error) {
			console.log(error);
		}
	};

	const findAllHelicopters = async () => {
		const response = await publicAxios.get("/helicopters");
		setHelicopters(response.data);
	};

	return { createHelicopter, findAllHelicopters };
};

export default useHelicopter;
