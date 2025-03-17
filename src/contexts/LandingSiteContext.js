import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const LandingSiteContext = createContext({});

export const LandingSiteProvider = ({ children }) => {
	const resetLandingSitestates = () => {};

	return (
		<LandingSiteContext.Provider
			value={{
				resetLandingSitestates,
			}}
		>
			{children}
		</LandingSiteContext.Provider>
	);
};

LandingSiteProvider.propTypes = {
	children: PropTypes.node,
};

export default LandingSiteContext;
