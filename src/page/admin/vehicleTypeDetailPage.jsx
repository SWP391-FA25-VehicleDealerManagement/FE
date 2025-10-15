import React from "react";
import VariantDetail from "../../sections/admin/vehicleManagement/variantDetail";
import { Helmet } from "react-helmet";
export default function VehicleTypeDetailPage() {
  return (
    <>
      <Helmet>
        <title>Vehicle Type Detail</title>
      </Helmet>
      <VariantDetail />
    </>
  );
}
