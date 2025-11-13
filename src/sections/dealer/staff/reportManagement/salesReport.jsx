import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  DatePicker,
  Button,
  Table,
  Tag,
  Descriptions,
} from "antd";
import {
  ReloadOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import useReport from "../../../../hooks/useReport";
import useAuthen from "../../../../hooks/useAuthen";

const { Title, Text } = Typography;

const VND = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

export default function DealerStaffSalesReport() {
  const { user } = useAuthen();
  const {
    isLoading,
    staffSelf,
    fetchStaffSelfSales,
    staffSelfTotalOrders,
    staffSelfTotalRevenue,
  } = useReport();

  const [month, setMonth] = useState();

  useEffect(() => {
    if (user?.userId) {
      fetchStaffSelfSales({ userId: user.userId });
    }
  }, [user?.userId, fetchStaffSelfSales]);

  const onMonthChange = (d) => {
    const payload = { userId: user?.userId };
    if (d) {
      payload.month = d.month() + 1;
      payload.year = d.year();
      setMonth({ month: payload.month, year: payload.year });
    } else {
      setMonth(undefined);
    }
    fetchStaffSelfSales(payload);
  };

  // đổi vai trò hiển thị
  const roleLabel =
    staffSelf?.role === "DEALER_STAFF"
      ? "Nhân viên"
      : staffSelf?.role === "DEALER_MANAGER"
      ? "Quản lý đại lý"
      : staffSelf?.role || "—";

  const columns = useMemo(
    () => [
      {
        title: "Ngày tạo",
        dataIndex: "createdDate",
        key: "createdDate",
        width: 160,
        render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
      },
      {
        title: "Mã đơn",
        dataIndex: "orderId",
        key: "orderId",
        width: 120,
        render: (v) => <Text strong>#{v ?? "—"}</Text>,
      },
      {
        title: "Doanh thu",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "right",
        render: (v) => <Tag color="blue">{VND(v)}</Tag>,
      },
    ],
    []
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>
          Báo cáo doanh thu cá nhân
        </Title>
        <Space>
          <DatePicker
            picker="month"
            onChange={onMonthChange}
            placeholder="Chọn tháng (tuỳ chọn)"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchStaffSelfSales({
                userId: user?.userId,
                month: month?.month,
                year: month?.year,
              })
            }
          >
            Tải lại
          </Button>
        </Space>
      </div>

      {/* Thông tin cá nhân */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions
          bordered
          size="small"
          column={{ xs: 1, sm: 2, md: 3 }}
          labelStyle={{ width: 120 }}
        >
          <Descriptions.Item label={<Space><UserOutlined />User</Space>}>
            {staffSelf?.userName || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            {staffSelf?.fullName || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            {roleLabel}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {staffSelf?.email || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="SĐT">
            {staffSelf?.phone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><ShopOutlined />Đại lý</Space>}>
            {staffSelf?.dealerName || "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* KPI */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical">
              <Text type="secondary">Tổng đơn</Text>
              <Space>
                <ShoppingCartOutlined />
                <Text strong style={{ fontSize: 22 }}>
                  {staffSelfTotalOrders()}
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Space direction="vertical">
              <Text type="secondary">Tổng doanh thu</Text>
              <Space>
                <DollarOutlined />
                <Text strong style={{ fontSize: 22 }}>
                  {VND(staffSelfTotalRevenue())}
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Bảng danh sách đơn */}
      <Card>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={staffSelf?.orders || []}
          rowKey={(r, idx) => r?.orderId ?? idx}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
}
