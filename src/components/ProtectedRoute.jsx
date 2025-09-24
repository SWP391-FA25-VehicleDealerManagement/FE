import React from "react";
import { Navigate } from "react-router-dom";
import Loading from "./loading";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
}) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // if (loading) {
  //   return <Loading />;
  // }

  // Kiểm tra có đăng nhập không
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // // Kiểm tra role có được phép không
  // if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/403" replace />;
  // }

  // // Kiểm tra permissions
  // if (requiredPermissions.length > 0) {
  //   const hasAllPermissions = requiredPermissions.every(permission =>
  //     hasPermission(permission)
  //   );

  //   if (!hasAllPermissions) {
  //     return <Navigate to="/403" replace />;
  //   }
  // }

  // return children;
};

export default ProtectedRoute;
