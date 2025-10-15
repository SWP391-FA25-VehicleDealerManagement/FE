import React from "react";
import VariantList from "../../sections/admin/vehicleManagement/variantList";
import { Helmet } from "react-helmet";
export default function VehicleTypeListPage() {
  return (
    <>
      <Helmet>
        <title>Vehicle Type List</title>
      </Helmet>
      <VariantList />
    </>
  );
}
