// src/sections/dealer/manager/customerManagement/customerDetail.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Table,
  Typography,
  Spin,
  Row,
  Col,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import useCustomerStore from "../../../../hooks/useCustomer";

const { Title } = Typography;

export default function CustomerDetail() {
  const { customerId } = useParams();
  const { customerDetail, isLoading, getCustomerById } = useCustomerStore();

  useEffect(() => {
    if (customerId) getCustomerById(customerId);
  }, [customerId, getCustomerById]);

  // demo data – thay bằng dữ liệu thực nếu có
  const interactions = [
    { key: "1", date: "2025-01-20", action: "Gọi điện", note: "Hỏi về VF8" },
    { key: "2", date: "2025-01-21", action: "Gửi báo giá", note: "VF8 Plus" },
  ];

  const interCols = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Hành động", dataIndex: "action", key: "action" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/dealer-manager/customer-list">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết khách hàng: {customerDetail?.customerName || "—"}
          </Title>
        </div>
      </div>

      <Row gutter={16}>
        {/* Thông tin khách hàng */}
        <Col span={8}>
          <Card title="Thông tin khách hàng" bordered={false}>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> Họ tên
                  </>
                }
              >
                {customerDetail?.customerName || "—"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> Số điện thoại
                  </>
                }
              >
                {customerDetail?.phone || "—"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <EnvironmentOutlined /> Địa chỉ
                  </>
                }
              >
                {customerDetail?.address || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {customerDetail?.note || "—"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Lịch sử tương tác / đơn hàng */}
        <Col span={16}>
          <Card>
            <Tabs
              items={[
                {
                  key: "1",
                  label: "Lịch sử đơn hàng",
                  children: (
                    <Table
                      columns={interCols}
                      dataSource={interactions}
                      pagination={{ pageSize: 5 }}
                      rowKey="key"
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
