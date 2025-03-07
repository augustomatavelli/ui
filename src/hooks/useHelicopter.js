import UseAxios from "./useAxios";

const useHelicopter = () => {
	const { publicAxios } = UseAxios();

	const createHelicopter = async (data) => {
		const response = await publicAxios.post("/helicopters", data);
	};

	const findAllHelicopters = async () => {
		const response = await publicAxios.get("/helicopters");
	};

	return { createHelicopter, findAllHelicopters };
};

export default useHelicopter;
