import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthen from "../hooks/useAuthen";
import Loading from "./loading";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
}) => {
  const { isAuthenticated, role, initAuth, isInitialized } = useAuthen();

  useEffect(() => {
    if (!isInitialized) {
      initAuth();
    }
  }, [initAuth, isInitialized]);

  // Hiển thị loading khi đang khởi tạo
  if (!isInitialized) {
    return <Loading />;
  }

  // Kiểm tra có đăng nhập không
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Kiểm tra role có được phép không
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
