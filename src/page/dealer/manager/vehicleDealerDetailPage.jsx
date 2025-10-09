import React from "react";
import VehicleDealerDetail from "../../../sections/dealer/manager/vehicleManagement/vehicleDealerDetail";
import { Helmet } from "react-helmet";

const VehicleDealerDetailPage = () => {
    return (
        <>
            <Helmet>
                <title>Thông tin phương tiện</title>
            </Helmet>
            <VehicleDealerDetail />
        </>
    );
};

export default VehicleDealerDetailPage;
