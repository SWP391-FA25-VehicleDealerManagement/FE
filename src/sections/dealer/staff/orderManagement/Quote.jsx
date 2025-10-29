import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  UserOutlined,
  FileTextOutlined,
  CarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import useAuthen from "../../../../hooks/useAuthen";
import useDealerOrder from "../../../../hooks/useDealerOrder";
import { toast } from "react-toastify";
import axiosClient from "../../../../config/axiosClient";

const { Title, Text } = Typography;

export default function Quote() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetail } = useAuthen();
  const { createDealerOrder, isLoadingCreateOrder } = useDealerOrder();
  const [quoteData, setQuoteData] = useState(location.state?.quoteData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleImageUrls, setVehicleImageUrls] = useState({});

  useEffect(() => {
    let objectUrlsToRevoke = [];
    const fetchAllImages = async () => {
      if (quoteData?.items && quoteData.items.length > 0) {
        const newImageUrls = { ...vehicleImageUrls };
        const pathsToFetch = quoteData.items
          .map((item) => item.vehicle?.variantImage)
          .filter(Boolean)
          .filter((path) => !newImageUrls[path]);
        if (pathsToFetch.length === 0) return;
        const fetchPromises = pathsToFetch.map(async (imagePath) => {
          try {
            const response = await axiosClient.get(imagePath, {
              responseType: "blob",
            });
            const objectUrl = URL.createObjectURL(response.data);
            objectUrlsToRevoke.push(objectUrl);
            return { path: imagePath, url: objectUrl };
          } catch (error) {
            console.error(`Không thể tải ảnh: ${imagePath}`, error);
            return { path: imagePath, url: null };
          }
        });
        const results = await Promise.all(fetchPromises);
        results.forEach((result) => {
          if (result) {
            newImageUrls[result.path] = result.url;
          }
        });
        setVehicleImageUrls(newImageUrls);
      }
    };

    fetchAllImages();
    return () => {
      objectUrlsToRevoke.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [quoteData]);

  // Hàm xử lý tạo đơn hàng
  const handleCreateOrder = async () => {
    if (
      !quoteData ||
      !quoteData.customer ||
      !quoteData.items ||
      !userDetail?.dealer?.dealerId ||
      !userDetail?.userId
    ) {
      toast.error("Thiếu thông tin để tạo đơn hàng.");
      return;
    }
    setIsLoading(true);
    const payload = {
      customerId: quoteData.customer.customerId,
      userId: userDetail.userId,
      dealerId: userDetail.dealer.dealerId,
      orderDetails: quoteData.items.map((item) => ({
        vehicleId: item.vehicleId,
        promotionId: null,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await createDealerOrder(payload);
      if (response && response.status === 200) {
        toast.success("Tạo đơn hàng thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/dealer-staff/orders");
      }
      s;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Tạo đơn hàng thất bại.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const itemColumns = [
    {
      title: "Xe",
      key: "vehicle",
      render: (_, record) => {
        // Lấy URL ảnh từ state
        const imageUrl = record.vehicle?.variantImage
          ? vehicleImageUrls[record.vehicle.variantImage]
          : null;
        const isImageLoading =
          record.vehicle?.variantImage &&
          !(record.vehicle.variantImage in vehicleImageUrls);
        return (
          <Space>
            <div
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f0f0f0",
                borderRadius: "4px",
              }}
            >
              {isImageLoading ? (
                <Spin size="small" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={record.vehicle?.variantName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  preview={true}
                />
              ) : (
                // Nếu không có ảnh/lỗi -> Icon placeholder
                <CarOutlined style={{ fontSize: 32, color: "#999" }} />
              )}
            </div>
            {/* Tên và VIN */}
            <div>
              <Text strong>
                {record.vehicle?.modelName} {record.vehicle?.variantName}
              </Text>
              <br />
              <Text type="secondary">VIN: {record.vehicle?.vinNumber}</Text>
            </div>
          </Space>
        );
      },
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

  // Hàm render nội dung chính của trang
  const renderContent = () => {
    if (!quoteData) {
      return (
        <Card>
          <Typography.Title level={4}>
            Không có dữ liệu báo giá để hiển thị. Vui lòng quay lại và tạo báo
            giá.
          </Typography.Title>
          <Button onClick={() => navigate(-1)}>Quay lại</Button>
        </Card>
      );
    }

    // Lấy dữ liệu từ quoteData đã được truyền vào
    const { customer, items, dealerInfo, quoteDate } = quoteData;
    // Tính toán tổng tiền
    const subtotal = items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    const discount = 0;
    const totalPayment = subtotal - discount;
    return (
      <Card id="quote-to-print">
        {/* Tiêu đề Báo Giá và Thông tin Đại lý */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              BÁO GIÁ
            </Title>
            <Text type="secondary">
              Ngày: {dayjs(quoteDate).format("DD/MM/YYYY")}
            </Text>
          </Col>
          <Col>
            <Title level={4} style={{ margin: 0, textAlign: "right" }}>
              {dealerInfo?.name || "Đại lý EVM"}
            </Title>
            {dealerInfo?.address && <Text block>{dealerInfo.address}</Text>}
          </Col>
        </Row>
        <Divider />

        {/* Thông tin khách hàng */}
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
              {customer.address && (
                <Descriptions.Item label="Địa chỉ">
                  {customer.address}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Col>
        </Row>
        <Divider />

        {/* Bảng chi tiết sản phẩm */}
        <Title level={4} style={{ marginTop: 24 }}>
          <CarOutlined /> Chi tiết sản phẩm
        </Title>
        <Table
          columns={itemColumns}
          dataSource={items}
          rowKey="vehicleId"
          pagination={false}
          bordered
        />

        {/* Phần tổng kết tiền */}
        <Row justify="end" style={{ marginTop: 24 }}>
          <Col span={8}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tổng tiền hàng">
                <Text strong style={{ fontSize: 16 }}>
                  {subtotal.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Giảm giá">
                <Text strong style={{ fontSize: 16, color: "green" }}>
                  - {discount.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng thanh toán">
                <Text strong type="danger" style={{ fontSize: 20 }}>
                  {totalPayment.toLocaleString("vi-VN")} VNĐ
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
      {/* Các nút hành động */}
      <Space className="action-buttons-container" style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>
          Quay lại
        </Button>
        <Button
          type="default"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
          disabled={!quoteData}
        >
          In báo giá
        </Button>

        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={handleCreateOrder}
          loading={isLoadingCreateOrder || isLoading}
          disabled={!quoteData}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Xác nhận & Tạo Đơn Hàng
        </Button>
      </Space>
      {renderContent()}
    </div>
  );
}
