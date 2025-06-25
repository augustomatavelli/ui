import { lazy } from "react";

// project import
import MainLayout from "layout/MainLayout";
import CommonLayout from "layout/CommonLayout";
import Loadable from "components/Loadable";
import AuthGuard from "utils/route-guard/AuthGuard";

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import("pages/dashboard/default")));

// render - users
const UserProfile = Loadable(lazy(() => import("pages/users/me")));
const ListUsersForAdmin = Loadable(lazy(() => import("pages/users/admin")));
const UserDetails = Loadable(lazy(() => import("pages/users/[id]")));

// render - operators
const ListOperatorsForAdmin = Loadable(lazy(() => import("pages/operators/admin")));
const OperatorDetails = Loadable(lazy(() => import("pages/operators/[id]")));

// render - aircrafts
const MyAircrafts = Loadable(lazy(() => import("pages/aircrafts/me")));
const AircraftDetails = Loadable(lazy(() => import("pages/aircrafts/[id]")));
const ListAircraftsForAdmin = Loadable(lazy(() => import("pages/aircrafts/admin")));

// render - aeródromos
const ListLandingSitesForAdmin = Loadable(lazy(() => import("pages/landing-sites/admin")));
const LandingSiteDetails = Loadable(lazy(() => import("pages/landing-sites/[id]")));

// render - solicitações
const ListRequestsForAdmin = Loadable(lazy(() => import("pages/requests/admin")));
const ListMyRequests = Loadable(lazy(() => import("pages/requests/me")));
const ListMyAircraftsRequests = Loadable(lazy(() => import("pages/requests/my-aircrafts")));
const CreateRequest = Loadable(lazy(() => import("pages/requests/create")));
const RequestDetails = Loadable(lazy(() => import("pages/requests/[id]")));
const LiveRequests = Loadable(lazy(() => import("pages/requests/live")));

// render - produtos
const ListProductsForAdmin = Loadable(lazy(() => import("pages/products/admin")));
const ProductDetails = Loadable(lazy(() => import("pages/products/[id]")));

// render - serviços
const ListOperationsForAdmin = Loadable(lazy(() => import("pages/operations/admin")));
const OperationDetails = Loadable(lazy(() => import("pages/operations/[id]")));

// render - serviços
const ListOrders = Loadable(lazy(() => import("pages/orders/list")));

// auth routing
const AuthLogin = Loadable(lazy(() => import("pages/auth/login")));
const AuthRegister = Loadable(lazy(() => import("pages/auth/register")));
const AuthForgotPassword = Loadable(lazy(() => import("pages/auth/forgot-password")));
const AuthResetPassword = Loadable(lazy(() => import("pages/auth/reset-password")));
const AuthCodeVerification = Loadable(lazy(() => import("pages/auth/code-verification")));

// error routing
const MaintenanceError = Loadable(lazy(() => import("pages/maintenance/404")));
const MaintenanceError500 = Loadable(lazy(() => import("pages/maintenance/500")));
const MaintenanceUnderConstruction = Loadable(lazy(() => import("pages/maintenance/under-construction")));
const MaintenanceComingSoon = Loadable(lazy(() => import("pages/maintenance/coming-soon")));

const ContactUs = Loadable(lazy(() => import("pages/contact-us")));

const MainRoutes = {
	path: "/",
	children: [
		{
			path: "/",
			element: (
				<AuthGuard requiredUserType="['A', 'P', 'C', 'O', 'S']">
					<MainLayout />
				</AuthGuard>
			),
			children: [
				{
					path: "dashboard",
					children: [
						{
							path: "default",
							element: <DashboardDefault />,
						},
					],
				},
				{
					path: "users",
					children: [
						{
							path: "me",
							element: <UserProfile />,
						},
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListUsersForAdmin />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<UserDetails />
								</AuthGuard>
							),
						},
					],
				},
				{
					path: "aircrafts",
					children: [
						{
							path: "me",
							element: (
								<AuthGuard requiredUserType="['O', 'P', 'S']">
									<MyAircrafts />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'O', 'P', 'S']">
									<AircraftDetails />
								</AuthGuard>
							),
						},
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListAircraftsForAdmin />
								</AuthGuard>
							),
						},
					],
				},
				/* 	{
					path: "landing-sites",
					children: [
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A']">
									<ListLandingSitesForAdmin />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A']">
									<LandingSiteDetails />
								</AuthGuard>
							),
						},
					],
				}, */
				{
					path: "operators",
					children: [
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListOperatorsForAdmin />
								</AuthGuard>
							),
						},
						/* {
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<OperatorDetails />
								</AuthGuard>
							),
						}, */
					],
				},
				{
					path: "requests",
					children: [
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListRequestsForAdmin />
								</AuthGuard>
							),
						},
						{
							path: "me",
							element: (
								<AuthGuard requiredUserType="['P', 'O', 'S']">
									<ListMyRequests />
								</AuthGuard>
							),
						},
						{
							path: "my-aircrafts",
							element: (
								<AuthGuard requiredUserType="['O', 'S']">
									<ListMyAircraftsRequests />
								</AuthGuard>
							),
						},
						{
							path: "create",
							element: (
								<AuthGuard requiredUserType="['O', 'P']">
									<CreateRequest />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'O', 'P', 'S']">
									<RequestDetails />
								</AuthGuard>
							),
						},
					],
				},
				{
					path: "products",
					children: [
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListProductsForAdmin />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ProductDetails />
								</AuthGuard>
							),
						},
					],
				},
				{
					path: "operations",
					children: [
						{
							path: "admin",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<ListOperationsForAdmin />
								</AuthGuard>
							),
						},
						{
							path: ":id",
							element: (
								<AuthGuard requiredUserType="['A', 'S']">
									<OperationDetails />
								</AuthGuard>
							),
						},
					],
				},
				{
					path: "orders",
					children: [
						{
							path: "",
							element: (
								<AuthGuard requiredUserType="['A', 'C', 'S']">
									<ListOrders />
								</AuthGuard>
							),
						},
					],
				},
			],
		},
		{
			path: "/live-requests",
			element: <CommonLayout />,
			children: [
				{
					path: "",
					element: <LiveRequests />,
				},
			],
		},
		{
			path: "reports",
			element: <CommonLayout />,
			children: [
				{
					path: "fuel",
					element: (
						<AuthGuard requiredUserType="['A', 'S']">
							<UserDetails />
						</AuthGuard>
					),
				},
				{
					path: "requests",
					element: (
						<AuthGuard requiredUserType="['A', 'S']">
							<UserDetails />
						</AuthGuard>
					),
				},
			],
		},
		{
			path: "/contact-us",
			element: <CommonLayout />,
			children: [
				{
					path: "",
					element: (
						<AuthGuard requiredUserType="['A', 'P', 'C', 'O', 'S']">
							<ContactUs />
						</AuthGuard>
					),
				},
			],
		},
		{
			path: "/maintenance",
			element: <CommonLayout />,
			children: [
				{
					path: "500",
					element: <MaintenanceError500 />,
				},
				{
					path: "under-construction",
					element: <MaintenanceUnderConstruction />,
				},
				{
					path: "coming-soon",
					element: <MaintenanceComingSoon />,
				},
			],
		},
		{
			path: "/auth",
			element: <CommonLayout />,
			children: [
				{
					path: "login",
					element: <AuthLogin />,
				},
				{
					path: "register",
					element: <AuthRegister />,
				},
				{
					path: "forgot-password",
					element: <AuthForgotPassword />,
				},
				{
					path: "reset-password",
					element: <AuthResetPassword />,
				},
				{
					path: "code-verification",
					element: <AuthCodeVerification />,
				},
			],
		},
		{
			path: "*",
			element: <MaintenanceError />,
		},
	],
};

export default MainRoutes;
