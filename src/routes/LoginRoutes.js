import { lazy } from "react";

// project import
import GuestGuard from "utils/route-guard/GuestGuard";
import CommonLayout from "layout/CommonLayout";
import Loadable from "components/Loadable";

// render - login
const AuthLogin = Loadable(lazy(() => import("pages/auth/login")));
const AuthRegister = Loadable(lazy(() => import("pages/auth/register")));
const AuthForgotPassword = Loadable(lazy(() => import("pages/auth/forgot-password")));
const AuthResetPassword = Loadable(lazy(() => import("pages/auth/reset-password")));
const AuthCodeVerification = Loadable(lazy(() => import("pages/auth/code-verification")));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
	path: "/",
	children: [
		{
			path: "/",
			element: (
				<GuestGuard>
					<CommonLayout />
				</GuestGuard>
			),
			children: [
				{
					path: "",
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
	],
};

export default LoginRoutes;
