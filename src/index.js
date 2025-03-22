import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// third-party
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// scroll bar
import "simplebar/dist/simplebar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// apex-chart
import "assets/third-party/apex-chart.css";
import "assets/third-party/react-table.css";

// project import
import App from "./App";
import { store, persister } from "store";
import { ConfigProvider } from "contexts/ConfigContext";
import { JWTProvider } from "contexts/JWTContext";
import { AuthProvider } from "contexts/AuthContext";
import reportWebVitals from "./reportWebVitals";
import { AircraftProvider } from "contexts/AircraftContext";
import { UserProvider } from "contexts/UserContext";
import { LandingSiteProvider } from "contexts/LandingSiteContext";
import { RequestProvider } from "contexts/RequestContext";
import { ProductsProvider } from "contexts/ProductsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
	<ReduxProvider store={store}>
		<PersistGate loading={null} persistor={persister}>
			<ConfigProvider>
				<BrowserRouter>
					<JWTProvider>
						<AuthProvider>
							<UserProvider>
								<AircraftProvider>
									<LandingSiteProvider>
										<RequestProvider>
											<ProductsProvider>
												<App />
											</ProductsProvider>
										</RequestProvider>
									</LandingSiteProvider>
								</AircraftProvider>
							</UserProvider>
						</AuthProvider>
					</JWTProvider>
				</BrowserRouter>
			</ConfigProvider>
		</PersistGate>
	</ReduxProvider>
);

reportWebVitals();
