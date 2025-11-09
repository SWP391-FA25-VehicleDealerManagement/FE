import React from "react";
import { Card } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const OrderCountChart = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.categories.map((category, index) => ({
    name: category,
    orders: data.values[index],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-purple-600">
            {payload[0].value} đơn hàng
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <LineChartOutlined className="mr-2 text-purple-600" />
          <span>Biểu đồ số lượng đơn hàng</span>
        </div>
      }
      className="shadow-sm mb-6"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#8884d8"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#8884d8"
            style={{ fontSize: "12px" }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="orders"
            fill="#722ed1"
            name="Số đơn hàng"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default OrderCountChart;
