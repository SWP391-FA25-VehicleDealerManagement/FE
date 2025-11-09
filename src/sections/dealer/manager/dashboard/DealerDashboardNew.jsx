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

export default function DealerDashboard() {
  const { userDetail } = useAuthen();
  const {
    fetchAllDashboardData,
    staffSalesData,
    customerData,
    orderData,
    customerDebtData,
    dealerDebtData,
    revenueData,
    isLoading,
  } = useDashboard();

  const [timePeriod, setTimePeriod] = useState("month");
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Fetch data on mount and when filters change
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

  // Process revenue chart data by time period
  const getRevenueChartData = () => {
    const ordersInfo = processOrdersData();
    const orders = ordersInfo.orders || [];

    if (timePeriod === "week") {
      // Group by week (last 8 weeks)
      const weeks = [];
      const values = [];
      
      for (let i = 7; i >= 0; i--) {
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

        weeks.push(`Tuần ${weekStart.format("DD/MM")}`);
        values.push(weekRevenue);
      }

      return { categories: weeks, values };
    } else if (timePeriod === "month") {
      // Group by month (last 12 months)
      const months = [];
      const values = [];

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

        months.push(month.format("MM/YYYY"));
        values.push(monthRevenue);
      }

      return { categories: months, values };
    } else if (timePeriod === "year") {
      // Group by year (last 5 years)
      const years = [];
      const values = [];

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

        years.push(year.format("YYYY"));
        values.push(yearRevenue);
      }

      return { categories: years, values };
    }

    return { categories: [], values: [] };
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

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
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
          <div className="flex items-center space-x-4">
            <Select
              value={timePeriod}
              style={{ width: 150 }}
              onChange={handleTimePeriodChange}
              options={[
                { value: "week", label: "Theo tuần" },
                { value: "month", label: "Theo tháng" },
                { value: "year", label: "Theo năm" },
              ]}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={getStatsData()} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart data={getRevenueChartData()} timePeriod={timePeriod} />
          <OrderStatusChart data={getOrderStatusChartData()} />
        </div>

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
