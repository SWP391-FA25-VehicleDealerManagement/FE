import React from "react";
import PromotionList from "../../sections/evm/promotionManagement/promotionList";
import { Helmet } from "react-helmet";

export default () => (
  <>
    <Helmet><title>Danh sách Khuyến mãi</title></Helmet>
    <PromotionList />
  </>
);