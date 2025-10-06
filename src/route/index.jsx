import React from "react";
import { Suspense, lazy } from "react";
import { useRoutes, Outlet, Navigate } from "react-router-dom";
import Dealer from "../layout/dealer.jsx";
import Admin from "../layout/admin.jsx";
import EvmStaff from "../layout/evmStaff.jsx";
import DealerStaff from "../layout/dealerStaff.jsx";
import Loading from "../components/loading.jsx";
import ScrollToTop from "../components/scrolltotop.jsx";
import Error404 from "../components/404.jsx";
import Error403 from "../components/403.jsx";
import useAuthen from "../hooks/useAuthen";

//Import page
//Authentication
const Login = lazy(() => import("../page/authen/LoginPage.jsx"));

//Admin
const AdminDashboard = lazy(() =>
  import("../page/admin/adminDashboardPage.jsx")
);
const EVMStaffPage = lazy(() => import("../page/admin/evmStaffPage.jsx"));


//Dealer Manager
const DealerDashboard = lazy(() =>
  import("../sections/dealer/manager/dashboard/dealerdashboard.jsx")
);

//EVM Staff
const EVMDashboard = lazy(() =>
  import("../sections/evm/dashboard/evmdashboard.jsx")
);
const DealerList = lazy(() => import("../page/evm/dealerListPage.jsx"));

//User Profile
const UserProfilePage = lazy(() => import("../page/profile/userProfilePage.jsx"));

//Dealer Staff

const Routes = () => {
  const { isAuthenticated, role, isInitialized } = useAuthen();

  // Hiển thị loading trong khi đang khởi tạo auth state
  if (!isInitialized) {
    return <Loading />;
  }

  // check role
  const RoleBasedRoute = ({ allowedRoles, children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/403" replace />;
    }

    return children;
  };

  // Redirect authenticated users từ login page
  const AuthGuard = ({ children }) => {
    if (isAuthenticated) {
      // Redirect based on role
      switch (role) {
        case "ADMIN":
          return <Navigate to="/admin/dashboard" replace />;
        case "EVM_STAFF":
          return <Navigate to="/evm-staff/dealer-list" replace />;
        case "DEALER_MANAGER":
          return <Navigate to="/dealer-manager/dashboard" replace />;
        case "DEALER_STAFF":
          return <Navigate to="/dealer-staff/customer-list" replace />;
        default:
          return <Navigate to="/403" replace />;
      }
    }
    return children;
  };

  const routes = useRoutes([
    {
      path: "/",
      element: (
        <AuthGuard>
          <Login />
        </AuthGuard>
      ),
    },
    { path: "/403", element: <Error403 /> },

    // Admin routes
    {
      path: "/admin/*",
      element: (
        <RoleBasedRoute allowedRoles={["ADMIN"]}>
          <Admin>
            <ScrollToTop>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ScrollToTop>
          </Admin>
        </RoleBasedRoute>
      ),
      children: [
        { path: "dashboard", element: <AdminDashboard /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "staff-management", element: <EVMStaffPage /> },
        { path: "*", element: <Error404 /> },
      ],
    },

    // EVM Staff routes
    {
      path: "/evm-staff/*",
      element: (
        <RoleBasedRoute allowedRoles={["EVM_STAFF"]}>
          <EvmStaff>
            <ScrollToTop>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ScrollToTop>
          </EvmStaff>
        </RoleBasedRoute>
      ),
      children: [
        { path: "dashboard", element: <EVMDashboard /> },
        { path: "dealer-list", element: <DealerList /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "*", element: <Error404 /> },
      ],
    },

    // Dealer Manager routes
    {
      path: "/dealer-manager/*",
      element: (
        <RoleBasedRoute allowedRoles={["DEALER_MANAGER"]}>
          <Dealer>
            <ScrollToTop>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ScrollToTop>
          </Dealer>
        </RoleBasedRoute>
      ),
      children: [
        { path: "dashboard", element: <DealerDashboard /> },
        { path: "customer-list", element: <DealerList /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "*", element: <Error404 /> },
      ],
    },

    // Dealer Staff routes
    {
      path: "/dealer-staff/*",
      element: (
        <RoleBasedRoute allowedRoles={["DEALER_STAFF"]}>
          <DealerStaff>
            <ScrollToTop>
              <Suspense fallback={<Loading />}>
                <Outlet />
              </Suspense>
            </ScrollToTop>
          </DealerStaff>
        </RoleBasedRoute>
      ),
      children: [
        { path: "dashboard", element: <DealerDashboard /> },
        { path: "customer-list", element: <DealerList /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "*", element: <Error404 /> },
      ],
    },
    { path: "*", element: <Error404 /> },
  ]);
  return routes;
};

export default Routes;
