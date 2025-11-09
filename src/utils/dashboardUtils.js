import dayjs from "dayjs";

/**
 * Format currency in VND
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

/**
 * Format compact currency (M for millions, B for billions)
 */
export const formatCompactCurrency = (amount) => {
  if (amount >= 1000000000) {
    return `₫${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `₫${(amount / 1000000).toFixed(0)}M`;
  }
  return formatCurrency(amount);
};

/**
 * Group orders by week
 */
export const groupOrdersByWeek = (orders, numberOfWeeks = 8) => {
  const weeks = [];
  const values = [];

  for (let i = numberOfWeeks - 1; i >= 0; i--) {
    const weekStart = dayjs().subtract(i, "week").startOf("week");
    const weekEnd = dayjs().subtract(i, "week").endOf("week");

    const weekOrders = orders.filter((order) => {
      if (!order.createdDate) return false;
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
};

/**
 * Group orders by month
 */
export const groupOrdersByMonth = (orders, numberOfMonths = 12) => {
  const months = [];
  const values = [];

  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const month = dayjs().subtract(i, "month");

    const monthOrders = orders.filter((order) => {
      if (!order.createdDate) return false;
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
};

/**
 * Group orders by year
 */
export const groupOrdersByYear = (orders, numberOfYears = 5) => {
  const years = [];
  const values = [];

  for (let i = numberOfYears - 1; i >= 0; i--) {
    const year = dayjs().subtract(i, "year");

    const yearOrders = orders.filter((order) => {
      if (!order.createdDate) return false;
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
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};

/**
 * Get order status label in Vietnamese
 */
export const getOrderStatusLabel = (status) => {
  const statusMap = {
    COMPLETED: "Hoàn thành",
    PENDING: "Chờ xử lý",
    PARTIAL: "Một phần",
    CANCELLED: "Đã hủy",
    PROCESSING: "Đang xử lý",
  };
  return statusMap[status] || status;
};

/**
 * Get debt status label in Vietnamese
 */
export const getDebtStatusLabel = (status, overdue) => {
  if (overdue) return "Quá hạn";
  
  const statusMap = {
    ACTIVE: "Đang hoạt động",
    PAID: "Đã thanh toán",
    PENDING: "Chờ xử lý",
  };
  return statusMap[status] || "Bình thường";
};
