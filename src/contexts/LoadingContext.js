import Loader from "components/Loader";
import { createContext, useContext, ReactNode } from "react";

const LoadingContext = createContext({});

export const LoadingProvider = ({ loadingUser, children }) => {
	return <LoadingContext.Provider value={{ loadingUser }}>{loadingUser ? <Loader /> : children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);
