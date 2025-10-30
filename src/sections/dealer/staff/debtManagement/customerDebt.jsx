import React, { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Typography, Spin } from "antd";
import { DollarOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useCustomerDebt from "../../../../hooks/useCustomerDebt";
import useAuthen from "../../../../hooks/useAuthen";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function CustomerDebt() {
  const { userDetail } = useAuthen();
  const navigate = useNavigate();
  const { customerDebtsList, isLoadingCustomerDebts, fetchCustomerDebtsById } =
    useCustomerDebt();

  useEffect(() => {
    if (userDetail?.dealer.dealerId) {
      fetchCustomerDebtsById(userDetail.dealer.dealerId);
    }
  }, [userDetail, fetchCustomerDebtsById]);

  const columns = [
    { title: "Mã Nợ", dataIndex: "debtId", key: "debtId", width: 80 },
    {
      title: "Tổng tiền",
      dataIndex: "amountDue",
      key: "amountDue",
      render: (val) => `${(val || 0).toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Đã trả",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (val) => (
        <Text type="success">{`${(val || 0).toLocaleString("vi-VN")} đ`}</Text>
      ),
    },
    {
      title: "Còn nợ",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (val) => (
        <Text type="danger" strong>{`${(val || 0).toLocaleString(
          "vi-VN"
        )} đ`}</Text>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let config = { color: "default", text: status };
        if (record.overdue && status !== "PAID") {
          config = { color: "error", text: "Quá hạn" };
        } else if (status === "ACTIVE") {
          config = { color: "processing", text: "Đang hoạt động" };
        } else if (status === "PAID") {
          config = { color: "success", text: "Đã thanh toán" };
        } else if (status === "PENDING") {
          config = { color: "warning", text: "Chờ duyệt" };
        }
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(`/dealer-staff/customer-debt/${record.debtId}`)
          }
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  if (isLoadingCustomerDebts) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} className="flex items-center">
        <DollarOutlined style={{ marginRight: 8 }} /> Công nợ của khách hàng
      </Title>
      <Text type="secondary">Theo dõi công nợ của khách hàng với Đại lý.</Text>

      <Card style={{ marginTop: 24 }}>
        <Table
          columns={columns}
          dataSource={customerDebtsList}
          rowKey="debtId"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
}
