import PropTypes from "prop-types";
import { createContext } from "react";

// third-party

// reducer - state management

// project import
import Loader from "components/Loader";

import AuthContext from "./AuthContext";

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext({});

export const JWTProvider = ({ children }) => {
	const resetPassword = async () => {};

	const updateProfile = () => {};

	return <JWTContext.Provider value={{ resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
	children: PropTypes.node,
};

export default JWTContext;
