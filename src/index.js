import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "simplebar/dist/simplebar.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "assets/third-party/apex-chart.css";
import "assets/third-party/react-table.css";
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
import { OperationsProvider } from "contexts/OperationContext";
import { OrderProvider } from "contexts/OrdersContext";
import { InspectionProvider } from "contexts/InspectionsContext";
import { OperatorProvider } from "contexts/OperatorContext";
import { ReportProvider } from "contexts/ReportContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<ReduxProvider store={store}>
		<PersistGate loading={null} persistor={persister}>
			<ConfigProvider>
				<BrowserRouter>
					<JWTProvider>
						<AuthProvider>
							<UserProvider>
								<ReportProvider>
									<AircraftProvider>
										<LandingSiteProvider>
											<RequestProvider>
												<ProductsProvider>
													<OperationsProvider>
														<OrderProvider>
															<InspectionProvider>
																<OperatorProvider>
																	<App />
																</OperatorProvider>
															</InspectionProvider>
														</OrderProvider>
													</OperationsProvider>
												</ProductsProvider>
											</RequestProvider>
										</LandingSiteProvider>
									</AircraftProvider>
								</ReportProvider>
							</UserProvider>
						</AuthProvider>
					</JWTProvider>
				</BrowserRouter>
			</ConfigProvider>
		</PersistGate>
	</ReduxProvider>
);

reportWebVitals();
