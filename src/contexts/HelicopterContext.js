import PropTypes from "prop-types";
import { createContext } from "react";

export const HelicopterContext = createContext({});

export const HelicopterProvider = ({ children }) => {
	return <HelicopterContext.Provider value={{}}>{children}</HelicopterContext.Provider>;
};

HelicopterProvider.propTypes = {
	children: PropTypes.node,
};

export default HelicopterContext;
