import React, { useState, useEffect } from "react";
import { Select, Spin, Row, Col } from "antd";
import {
  DollarOutlined,
  CarOutlined,
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useEvmDashboard from "../../../hooks/useEvmDashboard";
import StatsCards from "./StatsCards";
import RevenueChart from "./RevenueChart";
import RequestStatusChart from "./RequestStatusChart";
import DealerPerformanceTable from "./DealerPerformanceTable";
import DealerRequestTable from "./DealerRequestTable";
import {
  calculateStatsData,
  processRevenueChartData,
  processRequestStatusChartData,
  getTopDealers,
  formatCurrency,
} from "../../../utils/EVMdashboardUtils";

export default function AdminDashboardNew() {
  const {
    fetchAllEvmDashboardData,
    evmStaffData,
    dealerRequestData,
    dealerSaleData,
    dealerData,
    dealerDebtData,
    isLoading,
  } = useEvmDashboard();

  const [timePeriod, setTimePeriod] = useState("month");
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Fetch data on mount
  useEffect(() => {
    const year = currentDate.year();
    const month = currentDate.month() + 1;
    fetchAllEvmDashboardData(year, month);
  }, [currentDate]);

  // Tối ưu: Memoize stats data
  const statsData = React.useMemo(() => {
    const stats = calculateStatsData(
      dealerSaleData,
      dealerRequestData,
      dealerData,
      evmStaffData,
      dealerDebtData
    );

    return [
      {
        title: "Tổng doanh thu",
        value: formatCurrency(stats.totalRevenue),
        prefix: "₫",
        icon: <DollarOutlined />,
        color: "#1890ff",
      },
      {
        title: "Số đại lý",
        value: stats.totalDealers,
        icon: <ShopOutlined />,
        color: "#722ed1",
      },
      {
        title: "Nhân viên EVM",
        value: stats.totalEvmStaff,
        icon: <TeamOutlined />,
        color: "#13c2c2",
      },
      {
        title: "Yêu cầu đại lý",
        value: stats.totalRequestCount,
        icon: <FileTextOutlined />,
        color: "#fa8c16",
      },
      {
        title: "Tổng nợ đại lý",
        value: formatCurrency(stats.totalDealerDebt),
        prefix: "₫",
        icon: <WarningOutlined />,
        color: "#f5222d",
      },
    ];
  }, [dealerSaleData, dealerRequestData, dealerData, evmStaffData, dealerDebtData]);

  return (
    <div className="fade-in">
      <Spin spinning={isLoading}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Dashboard Quản trị viên
            </h1>
            <p className="text-gray-600">
              Tổng quan về hệ thống và hoạt động kinh doanh
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Thời gian:</span>
            <Select
              value={timePeriod}
              onChange={setTimePeriod}
              style={{ width: 150 }}
              options={[
                { label: "Theo tuần", value: "week" },
                { label: "Theo tháng", value: "month" },
                { label: "Theo năm", value: "year" },
              ]}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={statsData} />

        {/* Charts Section */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <RevenueChart
              data={React.useMemo(() => processRevenueChartData(dealerRequestData, timePeriod), [dealerRequestData, timePeriod])}
            />
          </Col>
          <Col xs={24} lg={12}>
            <RequestStatusChart
              data={React.useMemo(() => processRequestStatusChartData(dealerRequestData), [dealerRequestData])}
            />
          </Col>
        </Row>

        {/* Dealer Performance Table */}
        <DealerPerformanceTable data={React.useMemo(() => getTopDealers(dealerSaleData, 10), [dealerSaleData])} />

        {/* Dealer Request Table */}
        <DealerRequestTable data={dealerRequestData || []} />
      </Spin>
    </div>
  );
}
