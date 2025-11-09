import React from "react";
import { Card, Table } from "antd";

const DealerPerformanceTable = ({ data }) => {
  const columns = [
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tổng đơn",
      dataIndex: "totalOrders",
      key: "totalOrders",
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: "Doanh thu",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => `₫${new Intl.NumberFormat("vi-VN").format(value)}`,
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
  ];

  return (
    <Card title="Hiệu suất đại lý" className="shadow-sm mb-6">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="dealerId"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default DealerPerformanceTable;
