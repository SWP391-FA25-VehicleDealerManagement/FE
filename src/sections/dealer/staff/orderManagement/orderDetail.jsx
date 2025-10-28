// components/order/orderDetail.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Descriptions,
  Button,
  Space,
  List,
  Avatar,
  Tag,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  CarOutlined,
} from "@ant-design/icons";
import useDealerOrder from "../../../../hooks/useDealerOrder";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchCustomerOrderById, CustomerOrderDetail, isLoadingOrderDetail } =
    useDealerOrder();

  useEffect(() => {
    if (orderId) {
      fetchCustomerOrderById(orderId);
    }
  }, [orderId, fetchCustomerOrderById]);

  const handlePayment = () => {
    toast.info(`Thực hiện thanh toán cho đơn hàng ${orderId}`);
  };

  const handleCancelOrder = () => {
    toast.warn(`Thực hiện huỷ đơn hàng ${orderId}`);
  };

  const handleCreateQuote = () => {
    toast.info(`Tạo báo giá cho đơn hàng ${orderId}`);
  };

  if (isLoadingOrderDetail || !CustomerOrderDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const { customer, vehicles, totalAmount, status, orderDate } = CustomerOrderDetail; // Giả định cấu trúc data

  const isActionDisabled = status === "COMPLETED" || status === "CANCELLED";

  return (
    <div>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/dealer-staff/orders")}
        className="mb-4"
      >
        Quay lại danh sách
      </Button>

      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Chi tiết đơn hàng: #{orderDetail.orderId}</Title>
        <Space>
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            onClick={handlePayment}
            disabled={isActionDisabled}
          >
            Thanh toán
          </Button>
          <Button
            type="dashed"
            icon={<FileTextOutlined />}
            onClick={handleCreateQuote}
          >
            Tạo báo giá
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleCancelOrder}
            disabled={isActionDisabled}
          >
            Huỷ đơn
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {/* Thông tin khách hàng */}
        <Col span={10}>
          <Card title="Thông tin khách hàng" icon={<UserOutlined />}>
            {customer ? (
              <Descriptions column={1} layout="horizontal">
                <Descriptions.Item label={<UserOutlined />}>
                  {customer.fullName}
                </Descriptions.Item>
                <Descriptions.Item label={<PhoneOutlined />}>
                  {customer.phone}
                </Descriptions.Item>
                <Descriptions.Item label={<MailOutlined />}>
                  {customer.email}
                </Descriptions.Item>
                <Descriptions.Item label={<HomeOutlined />}>
                  {customer.address}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">Không có thông tin khách hàng.</Text>
            )}
          </Card>
        </Col>

        {/* Thông tin đơn hàng */}
        <Col span={14}>
          <Card title="Thông tin đơn hàng">
            <Descriptions column={2}>
              <Descriptions.Item label="Ngày tạo">
                {new Date(orderDate).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    isActionDisabled
                      ? status === "COMPLETED"
                        ? "success"
                        : "error"
                      : "processing"
                  }
                >
                  {status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <Title level={3} style={{ color: "red" }}>
                  {(totalAmount || 0).toLocaleString("vi-VN")} VNĐ
                </Title>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Danh sách xe */}
        <Col span={24}>
          <Card title="Danh sách xe trong đơn hàng">
            <List
              itemLayout="horizontal"
              dataSource={vehicles || []}
              renderItem={(vehicle) => (
                <List.Item
                  actions={[
                    <Text strong>
                      {(vehicle.price || 0).toLocaleString("vi-VN")} VNĐ
                    </Text>,
                    <Link to={`/dealer-staff/vehicles/${vehicle.vehicleId}`}>
                      Xem chi tiết xe
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={64}
                        icon={<CarOutlined />}
                        src={vehicle.variantImage} // Giả định
                      />
                    }
                    title={`${vehicle.modelName} ${vehicle.variantName}`}
                    description={`Màu: ${vehicle.color} - VIN: ${vehicle.vinNumber}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
