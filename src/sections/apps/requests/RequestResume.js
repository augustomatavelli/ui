import RequestContext from "contexts/RequestContext";
import { useContext } from "react";

export const RequestResume = ({}) => {
	const { requestResume } = useContext(RequestContext);
	console.log(requestResume);
};
