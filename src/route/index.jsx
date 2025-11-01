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
import CustomerDetail from "../sections/dealer/manager/customerManagement/customerDetail.jsx";

//Import page
//Authentication
const Login = lazy(() => import("../page/authen/LoginPage.jsx"));

//Admin
const AdminDashboard = lazy(() =>
  import("../page/admin/adminDashboardPage.jsx")
);
const EvmStaffPage = lazy(() => import("../page/admin/evmStaffPage.jsx"));
const EvmStaffDetailPage = lazy(() =>
  import("../page/admin/evmStaffDetailPage.jsx")
);

//Dealer Manager
const DealerDashboard = lazy(() =>
  import("../sections/dealer/manager/dashboard/dealerdashboard.jsx")
);
const VehicleListPage = lazy(() =>
  import("../page/dealer/manager/vehicleListPage.jsx")
);
const VehicleDetailPage = lazy(() =>
  import("../page/dealer/manager/vehicleDetailPage.jsx")
);
const RequestVehiclePage = lazy(() =>
  import("../page/dealer/manager/requestVehiclePage.jsx")
);
const RequestVehicleDetailPage = lazy(() =>
  import("../page/dealer/manager/requestVehicleDetailPage.jsx")
);
const RequestListPage = lazy(() =>
  import("../sections/dealer/manager/vehicleManagement/requestList.jsx")
);
const RequestDetailPage = lazy(() =>
  import("../sections/dealer/manager/vehicleManagement/requestDetail.jsx")
);
const InventoryPage = lazy(() =>
  import("../page/dealer/manager/inventoryListPage.jsx")
);
const StaffListPage = lazy(() =>
  import("../page/dealer/manager/staffListPage.jsx")
);
const StaffDetailPage = lazy(() =>
  import("../page/dealer/manager/staffDetailPage.jsx")
);
const DealerDebtPage = lazy(() =>
  import("../page/dealer/manager/dealerDebtPage.jsx")
);
const DealerDebtDetailPage = lazy(() =>
  import("../page/dealer/manager/dealerDebtDetailPage.jsx")
);
const DealerOrderList = lazy(() =>
  import("../page/dealer/manager/DealerOrderPage.jsx")
);
const DealerOrderDetail = lazy(() =>
  import("../page/dealer/manager/DealerOrderDetail.jsx")
);
const CustomerListPage = lazy(() =>
  import("../page/dealer/manager/customerListPage.jsx")
);
const CustomerDetailPage = lazy(() =>
  import("../page/dealer/manager/customerDetailPage.jsx")
);
const SalePriceListPage = lazy(() =>
  import("../page/dealer/manager/salePriceListPage.jsx")
);
const SalePriceDetailPage = lazy(() =>
  import("../page/dealer/manager/salePriceDetailPage.jsx")
);

//EVM Staff
const DealerList = lazy(() => import("../page/evm/dealerListPage.jsx"));
const DealerDetailPage = lazy(() => import("../page/evm/dealerDetailPage.jsx"));
const VehicleInventoryPage = lazy(() =>
  import("../page/evm/vehicleInventoryPage.jsx")
);
const AllocateInventoryPage = lazy(() =>
  import("../page/evm/allocateInventoryPage.jsx")
);
const ContractsTargetsPage = lazy(() =>
  import("../page/evm/contractsTargetsPage.jsx")
);
const EvmDealerDebtsPage = lazy(() =>
  import("../page/evm/dealerDebtsPage.jsx")
);
const VehicleList = lazy(() => import("../page/evm/vehicleListPage.jsx"));
const VehicleDetail = lazy(() => import("../page/evm/vehicleDetailPage.jsx"));
const VehicleTypeList = lazy(() =>
  import("../page/evm/vehicleTypeListPage.jsx")
);
const VehicleTypeDetail = lazy(() =>
  import("../page/evm/vehicleTypeDetailPage.jsx")
);
const VehicleModelList = lazy(() =>
  import("../page/evm/vehicleModelListPage.jsx")
);
const VehicleModelDetail = lazy(() =>
  import("../page/evm/vehicleModelDetailPage.jsx")
);
const EVMDealerDebtDetailPage = lazy(() =>
  import("../page/evm/dealerDebtDetailPage.jsx")
);

//User Profile
const UserProfilePage = lazy(() =>
  import("../page/profile/userProfilePage.jsx")
);

//Dealer Staff
const DealerStaffVehicleListPage = lazy(() =>
  import("../page/dealer/staff/vehicleListPage.jsx")
);
const DealerStaffVehicleDetailPage = lazy(() =>
  import("../page/dealer/staff/vehicleDetail.jsx")
);
const DealerStaffCustomerListPage = lazy(() =>
  import("../page/dealer/staff/customerListPage.jsx")
);
const DealerStaffCustomerDetailPage = lazy(() =>
  import("../page/dealer/staff/customerDetailPage.jsx")
);
const CustomerOrderPage = lazy(() =>
  import("../page/dealer/staff/customerOrderPage.jsx")
);
const CustomerOrderDetailPage = lazy(() =>
  import("../page/dealer/staff/customerOrderDetailPage.jsx")
);
const QuotePage = lazy(() => import("../page/dealer/staff/QuotePage.jsx"));
const CustomerDebtPage = lazy(() =>
  import("../page/dealer/staff/customerDebtPage.jsx")
);
const CustomerDebtDetailPage = lazy(() =>
  import("../page/dealer/staff/customerDebtDetailPage.jsx")
);
const AppointmentTestDrivePage = lazy(() =>
  import("../page/dealer/staff/appointmentTestDrivePage.jsx")
);
const DeliveryPage = lazy(() =>
  import("../page/dealer/staff/deiliveryPage.jsx")
);
const DeliveryDetailPage = lazy(() =>
  import("../page/dealer/staff/deliveryDetailPage.jsx")
);

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
          return <Navigate to="/dealer-staff/appointments" replace />;
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
        { path: "staff-management", element: <EvmStaffPage /> },
        { path: "staff-management/:staffId", element: <EvmStaffDetailPage /> },
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
        { path: "dealer-list", element: <DealerList /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "dealer-list/:dealerId", element: <DealerDetailPage /> },
        { path: "contracts-targets", element: <ContractsTargetsPage /> },
        { path: "debts", element: <EvmDealerDebtsPage /> },
        { path: "debts/:debtId", element: <EVMDealerDebtDetailPage /> },
        { path: "vehicles", element: <VehicleList /> },
        { path: "vehicles/:vehicleId", element: <VehicleDetail /> },
        { path: "vehicle-types", element: <VehicleTypeList /> },
        { path: "vehicle-types/:variantId", element: <VehicleTypeDetail /> },
        { path: "vehicle-models", element: <VehicleModelList /> },
        { path: "vehicle-models/:id", element: <VehicleModelDetail /> },
        { path: "inventory", element: <VehicleInventoryPage /> },
        { path: "allocate-inventory", element: <AllocateInventoryPage /> },
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
        { path: "customer-list", element: <CustomerListPage /> },
        { path: "customer-list/:id", element: <CustomerDetail /> },
        { path: "customer-list/:customerId", element: <CustomerDetail /> },
        { path: "profile", element: <UserProfilePage /> },
        { path: "vehicles", element: <VehicleListPage /> },
        { path: "vehicles/:id", element: <VehicleDetailPage /> },
        { path: "vehicle-requests", element: <RequestVehiclePage /> },
        { path: "vehicle-requests/:id", element: <RequestVehicleDetailPage /> },
        { path: "request-list", element: <RequestListPage /> },
        { path: "request-list/:id", element: <RequestDetailPage /> },
        { path: "staff", element: <StaffListPage /> },
        { path: "staff/:staffId", element: <StaffDetailPage /> },
        { path: "staff", element: <StaffListPage /> },
        { path: "staff/:staffId", element: <StaffDetailPage /> },
        { path: "inventory", element: <InventoryPage /> },
        { path: "dealer-debt", element: <DealerDebtPage /> },
        { path: "dealer-debt/:debtId", element: <DealerDebtDetailPage /> },
        { path: "dealer-orders", element: <DealerOrderList /> },
        { path: "dealer-orders/:orderId", element: <DealerOrderDetail /> },
        { path: "sale-prices", element: <SalePriceListPage /> },
        { path: "sale-prices/:salePriceId", element: <SalePriceDetailPage /> },
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
        { path: "customer-list", element: <DealerStaffCustomerListPage /> },
        {
          path: "customers/:customerId",
          element: <DealerStaffCustomerDetailPage />,
        },
        { path: "profile", element: <UserProfilePage /> },
        { path: "vehicles", element: <DealerStaffVehicleListPage /> },
        {
          path: "vehicles/:vehicleId",
          element: <DealerStaffVehicleDetailPage />,
        },
        { path: "inventory", element: <InventoryPage /> },
        { path: "orders", element: <CustomerOrderPage /> },
        { path: "orders/:orderId", element: <CustomerOrderDetailPage /> },
        { path: "quote-preview", element: <QuotePage /> },
        { path: "customer-debt", element: <CustomerDebtPage /> },
        { path: "customer-debt/:debtId", element: <CustomerDebtDetailPage /> },
        { path: "appointments", element: <AppointmentTestDrivePage /> },
        { path: "deliveries", element: <DeliveryPage /> },
        { path: "deliveries/:orderId", element: <DeliveryDetailPage /> },
        { path: "*", element: <Error404 /> },
      ],
    },
    { path: "*", element: <Error404 /> },
  ]);
  return routes;
};

export default Routes;
