import React from "react";
import { Card, Table, Tag } from "antd";
import { BankOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const DealerDebtTable = ({ data }) => {
  const columns = [
    {
      title: "Mã nợ",
      dataIndex: "debtId",
      key: "debtId",
      render: (id) => `#${id}`,
    },
    {
      title: "Loại nợ",
      dataIndex: "debtType",
      key: "debtType",
    },
    {
      title: "Tổng nợ (VNĐ)",
      dataIndex: "amountDue",
      key: "amountDue",
      render: (val) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val || 0),
      sorter: (a, b) => a.amountDue - b.amountDue,
    },
    {
      title: "Đã trả (VNĐ)",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (val) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val || 0),
    },
    {
      title: "Còn lại (VNĐ)",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (val) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(val || 0),
      sorter: (a, b) => a.remainingAmount - b.remainingAmount,
    },
    {
      title: "Ngày đến hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "Chưa có"),
      sorter: (a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "green";
        let text = "Bình thường";
        
        if (record.overdue) {
          color = "red";
          text = "Quá hạn";
        } else if (status === "ACTIVE") {
          color = "blue";
          text = "Đang hoạt động";
        } else if (status === "PAID") {
          color = "green";
          text = "Đã thanh toán";
        } else if (status === "PENDING") {
          color = "orange";
          text = "Chờ xử lý";
        }

        return (
          <Tag color={color}>
            {record.overdue && <ExclamationCircleOutlined />} {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BankOutlined className="mr-2 text-red-600" />
            <span>Nợ với hãng (VinFast)</span>
          </div>
          <div className="text-sm font-normal text-gray-500">
            Tổng: {data?.length || 0} khoản nợ
          </div>
        </div>
      }
      className="shadow-sm mb-6"
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        size="middle"
        rowKey="debtId"
      />
    </Card>
  );
};

export default DealerDebtTable;
