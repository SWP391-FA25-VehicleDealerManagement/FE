import React from "react";
import VehicleList from "../../sections/admin/vehicleManagement/vehicleList";
import { Helmet } from "react-helmet";

const VehicleListPage = () => {
  return (
    <>
      <Helmet>
        <title>Vehicle List</title>
      </Helmet>
      <VehicleList />
    </>
  );
};

export default VehicleListPage;
