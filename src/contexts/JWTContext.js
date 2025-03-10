import PropTypes from "prop-types";
import { createContext } from "react";

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext({});

export const JWTProvider = ({ children }) => {
	return <JWTContext.Provider value={{}}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
	children: PropTypes.node,
};

export default JWTContext;
