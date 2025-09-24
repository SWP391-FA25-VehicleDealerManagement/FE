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


//Import page 
//Authentication
const Login = lazy(() => import("../page/authen/LoginPage.jsx"));

//Admin
const AdminDashboard = lazy(() =>
  import("../page/admin/adminDashboardPage.jsx")
);

//Dealer Manager
const DealerDashboard = lazy(() =>
  import("../sections/dealer/manager/dashboard/dealerdashboard.jsx")
);

//EVM Staff
const EVMDashboard = lazy(() =>
  import("../sections/evm/dashboard/evmdashboard.jsx")
);

//Dealer Staff

const Routes = () => {

  // Hook để lấy thông tin authentication
  const useAuth = () => {
    const token = localStorage.getItem('isAuthenticated');
    return {
      isAuthenticated: !!token,
    };
  };

  const { isAuthenticated } = useAuth();

  // check role
  const RoleBasedRoute = ({ allowedRoles, children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    
    // if (allowedRoles && !allowedRoles.includes(userRole)) {
    //   return <Navigate to="/403" replace />;
    // }
    
    return children;
  };

  const routes = useRoutes([
    { path: "/", element: <Login /> },
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
        { path: "*", element: <Error404 /> },
      ],
    },
    {path: "*", element: <Error404 /> },
  ]);
  return routes;
};

export default Routes;