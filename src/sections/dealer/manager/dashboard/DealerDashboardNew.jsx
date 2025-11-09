import React, { useState, useEffect } from "react";
import { Select, Spin, message } from "antd";
import dayjs from "dayjs";
import useAuthen from "../../../../hooks/useAuthen";
import useDashboard from "../../../../hooks/useDashboard";
import StatsCards from "./StatsCards";
import RevenueChart from "./RevenueChart";
import StaffPerformance from "./StaffPerformance";
import CustomerDebtTable from "./CustomerDebtTable";
import DealerDebtTable from "./DealerDebtTable";
import OrderStatusChart from "./OrderStatusChart";
import OrderCountChart from "./OrderCountChart";

export default function DealerDashboard() {
  const { userDetail } = useAuthen();
  const {
    fetchAllDashboardData,
    staffSalesData,
    staffData,
    customerData,
    orderData,
    customerDebtData,
    dealerDebtData,
    revenueData,
    isLoading,
  } = useDashboard();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [timePeriod, setTimePeriod] = useState("month");

  useEffect(() => {
    if (userDetail?.dealer?.dealerId) {
      const year = currentDate.year();
      const month = currentDate.month() + 1;
      fetchAllDashboardData(userDetail?.dealer.dealerId, year, month);
    }
  }, [userDetail, currentDate]);

  // Process orders data (only orders with customerId)
  const processOrdersData = () => {
    if (!orderData) return { total: 0, totalAmount: 0, statusCounts: {} };

    const ordersWithCustomers = orderData.filter(
      (order) => order.customerId !== null
    );

    const totalAmount = ordersWithCustomers.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    const statusCounts = ordersWithCustomers.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: ordersWithCustomers.length,
      totalAmount,
      statusCounts,
      orders: ordersWithCustomers,
    };
  };

  // Calculate stats cards data
  const getStatsData = () => {
    const ordersInfo = processOrdersData();
    
    const totalCustomerDebt = customerDebtData?.reduce(
      (sum, debt) => sum + (debt.remainingAmount || 0),
      0
    ) || 0;

    const totalDealerDebt = dealerDebtData?.reduce(
      (sum, debt) => sum + (debt.remainingAmount || 0),
      0
    ) || 0;

    return [
      {
        type: "revenue",
        title: "Tổng doanh thu",
        value: new Intl.NumberFormat("vi-VN").format(ordersInfo.totalAmount),
        prefix: "₫",
        change: "+12.4%",
        isPositive: true,
      },
      {
        type: "staff",
        title: "Nhân viên",
        value: staffData?.length || 0,
        change: "+5%",
        isPositive: true,
      },
      {
        type: "customers",
        title: "Khách hàng",
        value: customerData?.length || 0,
        change: "+8%",
        isPositive: true,
      },
      {
        type: "orders",
        title: "Tổng đơn hàng",
        value: ordersInfo.total,
        change: "+15%",
        isPositive: true,
      },
      {
        type: "customerDebt",
        title: "Nợ khách hàng",
        value: new Intl.NumberFormat("vi-VN").format(totalCustomerDebt),
        prefix: "₫",
        change: "-5.7%",
        isPositive: true,
      },
      {
        type: "dealerDebt",
        title: "Nợ với hãng",
        value: new Intl.NumberFormat("vi-VN").format(totalDealerDebt),
        prefix: "₫",
        change: "-3.2%",
        isPositive: true,
      },
    ];
  };

  // Process revenue chart data
  const getRevenueChartData = () => {
    const ordersInfo = processOrdersData();
    const orders = ordersInfo.orders || [];

    const categories = [];
    const values = [];

    if (timePeriod === "week") {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const weekStart = dayjs().subtract(i, "week").startOf("week");
        const weekEnd = dayjs().subtract(i, "week").endOf("week");
        
        const weekOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return orderDate.isAfter(weekStart) && orderDate.isBefore(weekEnd);
        });

        const weekRevenue = weekOrders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );

        categories.push(`${weekStart.format("DD/MM")} - ${weekEnd.format("DD/MM")}`);
        values.push(weekRevenue);
      }
    } else if (timePeriod === "month") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, "month");
        
        const monthOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return (
            orderDate.year() === month.year() &&
            orderDate.month() === month.month()
          );
        });

        const monthRevenue = monthOrders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );

        categories.push(month.format("MM/YYYY"));
        values.push(monthRevenue);
      }
    } else if (timePeriod === "year") {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = dayjs().subtract(i, "year");
        
        const yearOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return orderDate.year() === year.year();
        });

        const yearRevenue = yearOrders.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        );

        categories.push(year.format("YYYY"));
        values.push(yearRevenue);
      }
    }

    return { categories, values };
  };

  // Process order status chart data
  const getOrderStatusChartData = () => {
    const ordersInfo = processOrdersData();
    const statusCounts = ordersInfo.statusCounts || {};

    const statusLabels = Object.keys(statusCounts).map((status) => {
      const statusMap = {
        COMPLETED: "Hoàn thành",
        PENDING: "Chờ xử lý",
        PARTIAL: "Một phần",
        CANCELLED: "Đã hủy",
        PROCESSING: "Đang xử lý",
      };
      return statusMap[status] || status;
    });

    const statusValues = Object.values(statusCounts);

    return {
      labels: statusLabels,
      values: statusValues,
    };
  };

  // Process order count chart data
  const getOrderCountChartData = () => {
    const ordersInfo = processOrdersData();
    const orders = ordersInfo.orders || [];

    const categories = [];
    const values = [];

    if (timePeriod === "week") {
      // Last 12 weeks
      for (let i = 11; i >= 0; i--) {
        const weekStart = dayjs().subtract(i, "week").startOf("week");
        const weekEnd = dayjs().subtract(i, "week").endOf("week");
        
        const weekOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return orderDate.isAfter(weekStart) && orderDate.isBefore(weekEnd);
        });

        categories.push(`${weekStart.format("DD/MM")} - ${weekEnd.format("DD/MM")}`);
        values.push(weekOrders.length);
      }
    } else if (timePeriod === "month") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const month = dayjs().subtract(i, "month");
        
        const monthOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return (
            orderDate.year() === month.year() &&
            orderDate.month() === month.month()
          );
        });

        categories.push(month.format("MM/YYYY"));
        values.push(monthOrders.length);
      }
    } else if (timePeriod === "year") {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = dayjs().subtract(i, "year");
        
        const yearOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdDate);
          return orderDate.year() === year.year();
        });

        categories.push(year.format("YYYY"));
        values.push(yearOrders.length);
      }
    }

    return { categories, values };
  };

  // Add customer names to debt data
  const enrichCustomerDebtData = () => {
    if (!customerDebtData || !customerData) return customerDebtData;

    return customerDebtData.map((debt) => {
      const customer = customerData.find((c) => c.customerId === debt.customerId);
      return {
        ...debt,
        customerName: customer?.customerName || `Customer #${debt.customerId}`,
      };
    });
  };

  return (
    <div className="fade-in">
      <Spin spinning={isLoading}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bảng điều khiển Dashboard
            </h1>
            <p className="text-gray-600">
              Tổng quan về doanh thu, đơn hàng và công nợ
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
        <StatsCards stats={getStatsData()} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart data={getRevenueChartData()} />
          <OrderStatusChart data={getOrderStatusChartData()} />
        </div>

        {/* Order Count Chart */}
        <OrderCountChart data={getOrderCountChartData()} />

        {/* Staff Performance */}
        <StaffPerformance data={staffSalesData || []} />

        {/* Customer Debt Table */}
        <CustomerDebtTable data={enrichCustomerDebtData() || []} />

        {/* Dealer Debt Table */}
        <DealerDebtTable data={dealerDebtData || []} />
      </Spin>
    </div>
  );
}
