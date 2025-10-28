import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Spin,
  Button,
  Typography,
  Descriptions,
  Table,
  Divider,
  Row,
  Col,
  Tag,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  UserOutlined,
  FileTextOutlined,
  CarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useAuthen from "../../../../hooks/useAuthen";
import useDealerOrder from "../../../../hooks/useDealerOrder"; //
import useVehicleStore from "../../../../hooks/useVehicle"; //

const { Title, Text } = Typography;

export default function Quote() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");
  const navigate = useNavigate();
  const { userDetail } = useAuthen();

  // State từ các store
  const {
    CustomerOrder,
    getCustomerOrders,
    CustomerDetail,
    isLoadingCustomerDetail,
    getCustomerById,
    CustomerOrderDetail,
    isLoadingOrderDetail,
    fetchCustomerOrderById,
  } = useDealerOrder();
  const { fetchVehicleById } = useVehicleStore();

  // State local để lưu chi tiết xe
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  const dealerId = userDetail?.dealer?.dealerId;

  useEffect(() => {
    if (orderId && customerId && dealerId) {
      fetchCustomerOrderById(orderId);
      getCustomerById(customerId);
      getCustomerOrders(dealerId);
    }
  }, [
    orderId,
    customerId,
    dealerId,
    fetchCustomerOrderById,
    getCustomerById,
    getCustomerOrders,
  ]);

  // 2. Tải chi tiết xe (sau khi đã tải xong OrderDetail)
  useEffect(() => {
    if (CustomerOrderDetail && CustomerOrderDetail.length > 0) {
      const fetchVehicles = async () => {
        setIsLoadingVehicles(true);
        try {
          const vehiclePromises = CustomerOrderDetail.map(
            (item) => fetchVehicleById(item.vehicleId) 
          );
          const vehicles = await Promise.all(vehiclePromises);
          setVehicleDetails(vehicles); 
        } catch (error) {
          console.error("Lỗi khi tải chi tiết xe:", error);
        } finally {
          setIsLoadingVehicles(false);
        }
      };
      fetchVehicles();
    }
  }, [CustomerOrderDetail, fetchVehicleById]);

  // 3. Gộp tất cả dữ liệu lại
  const quoteData = useMemo(() => {
    if (
      !CustomerOrderDetail ||
      !CustomerDetail ||
      !CustomerOrder ||
      vehicleDetails.length === 0
    ) {
      return null;
    }

    // Tìm đơn hàng chính từ danh sách
    const order = CustomerOrder.find((o) => o.orderId == orderId);
    if (!order) return null;
    const items = CustomerOrderDetail.map((item) => {
      const vehicle = vehicleDetails.find((v) => v.vehicleId == item.vehicleId);
      return { ...item, vehicle }; //
    });

    return {
      order,
      customer: CustomerDetail, 
      items,
    };
  }, [
    CustomerOrderDetail,
    CustomerDetail,
    CustomerOrder,
    vehicleDetails,
    orderId,
  ]);

  const itemColumns = [
    {
      title: "Xe",
      key: "vehicle",
      render: (_, record) => (
        <div>
          <Text strong>
            {record.vehicle?.modelName} {record.vehicle?.variantName}
          </Text>
          <br />
          <Text type="secondary">VIN: {record.vehicle?.vinNumber}</Text>
        </div>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: ["vehicle", "color"],
      key: "color",
      width: 120,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      align: "right",
      render: (price) => `${(price || 0).toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 150,
      align: "right",
      render: (price) => (
        <Text strong>{`${(price || 0).toLocaleString("vi-VN")} VNĐ`}</Text>
      ),
    },
  ];

  const isLoading =
    isLoadingOrderDetail || isLoadingCustomerDetail || isLoadingVehicles;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-20">
          <Spin size="large" />
        </div>
      );
    }

    if (!quoteData) {
      return (
        <Card>
          <Typography.Title level={4}>
            Không tìm thấy dữ liệu báo giá.
          </Typography.Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Card>
      );
    }

    const { order, customer, items } = quoteData;

    return (
      <Card id="quote-to-print">
        {/* Tiêu đề */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              BÁO GIÁ
            </Title>
            <Text type="secondary">
              Mã đơn hàng: #{order.orderId} | Ngày:{" "}
              {dayjs(order.createdDate).format("DD/MM/YYYY")}
            </Text>
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0, textAlign: "right" }}>
              {userDetail?.dealer?.dealerName || "Đại lý EVM"}
            </Title>
          </Col>
        </Row>

        <Divider />

        {/* Thông tin khách hàng và đơn hàng */}
        <Row gutter={32}>
          <Col span={12}>
            <Descriptions
              title={
                <Space>
                  <UserOutlined /> Khách hàng
                </Space>
              }
              column={1}
            >
              <Descriptions.Item label="Họ tên">
                {customer.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {customer.phone}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions
              title={
                <Space>
                  <FileTextOutlined /> Đơn hàng
                </Space>
              }
              column={1}
            >
              <Descriptions.Item label="Phương thức thanh toán">
                {order.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color="blue">{order.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />

        {/* Chi tiết xe */}
        <Title level={4} style={{ marginTop: 24 }}>
          <CarOutlined /> Chi tiết sản phẩm
        </Title>
        <Table
          columns={itemColumns}
          dataSource={items}
          rowKey="orderDetailId"
          pagination={false}
          bordered
        />

        {/* Tổng kết */}
        <Row justify="end" style={{ marginTop: 24 }}>
          <Col span={8}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tổng tiền hàng">
                <Text strong style={{ fontSize: 16 }}>
                  {(order.totalPrice || 0).toLocaleString("vi-VN")} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                <Text strong style={{ fontSize: 16, color: "green" }}>
                  - 0 VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thanh toán">
                <Text strong type="danger" style={{ fontSize: 20 }}>
                  {(order.totalAmount || 0).toLocaleString("vi-VN")} VNĐ
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Quay lại
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          disabled={isLoading || !quoteData}
        >
          In báo giá
        </Button>
      </Space>

      {renderContent()}
    </div>
  );
}
