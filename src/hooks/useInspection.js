import UseAxios from "./useAxios";
import { useContext } from "react";
import InspectionContext from "contexts/InspectionsContext";
import { runRequest } from "utils/api/runRequest";

const useInspection = () => {
	const { publicAxios } = UseAxios();

	const { setInspections, setLoadingInspection } = useContext(InspectionContext);

	const findAllInspectionsByOrder = async (orderId, signal) => {
		const { data } = await runRequest(() => publicAxios.get(`/inspections/${orderId}`, { signal }), { setLoading: setLoadingInspection });
		if (data) {
			setInspections(data);
		}
		return data;
	};

	const updateInspectionOrderCompliance = async (orderId, data) => {
		const { data: result } = await runRequest(() => publicAxios.patch(`/inspections/${orderId}`, data), { setLoading: setLoadingInspection });
		return result;
	};

	return { findAllInspectionsByOrder, updateInspectionOrderCompliance };
};

export default useInspection;
