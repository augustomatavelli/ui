import { useContext, useEffect, useState } from "react";

// project import
import Routes from "routes";
import ThemeCustomization from "themes";

import Loader from "components/Loader";
import Locales from "components/Locales";
import RTLLayout from "components/RTLLayout";
import ScrollTop from "components/ScrollTop";
import Snackbar from "components/@extended/Snackbar";
import Notistack from "components/third-party/Notistack";
import { LoadingProvider } from "contexts/LoadingContext";
import UserContext from "contexts/UserContext";

// auth provider

// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
	const { loadingUser } = useContext(UserContext);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(false);
	}, []);

	if (loading) return <Loader />;

	return (
		<ThemeCustomization>
			<RTLLayout>
				<Locales>
					<ScrollTop>
						<Notistack>
							<LoadingProvider loadingUser={loadingUser}>
								<Routes />
								<Snackbar />
							</LoadingProvider>
						</Notistack>
					</ScrollTop>
				</Locales>
			</RTLLayout>
		</ThemeCustomization>
	);
};

export default App;
