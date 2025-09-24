import React from "react";
import AdminDashboard from "../../sections/admin/dashboard/admindashboard.jsx";
import { Helmet } from "react-helmet";
export default function adminDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <AdminDashboard />
    </>
  );
}
