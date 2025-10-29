import React, { useEffect, useState, useMemo } from "react";
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
  Image,
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
import useAuthen from "../../../../hooks/useAuthen";
import useVehicleStore from "../../../../hooks/useVehicle";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axiosClient from "../../../../config/axiosClient";

const { Title, Text } = Typography;

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { userDetail } = useAuthen();

  const {
    CustomerOrder,
    isLoadingCustomerOrder,
    getCustomerOrders,
    CustomerDetail,
    isLoadingCustomerDetail,
    getCustomerById,
    CustomerOrderDetail,
    isLoadingOrderDetail,
    fetchCustomerOrderById,
  } = useDealerOrder();
  const { fetchVehicleById } = useVehicleStore();
  const [orderInfo, setOrderInfo] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [error, setError] = useState(null);
  const [vehicleImageUrls, setVehicleImageUrls] = useState({});

  const dealerId = userDetail?.dealer?.dealerId;

  // 3. Fetch Order Details (Items) first
  useEffect(() => {
    if (orderId) {
      fetchCustomerOrderById(orderId);
    }
  }, [orderId, fetchCustomerOrderById]);

  useEffect(() => {
    const fetchOrderAndCustomer = async () => {
      if (!orderId || !dealerId) return;

      try {
        await getCustomerOrders(dealerId); //
      } catch (err) {
        console.error("Error fetching order list:", err);
        setError("Không thể tải danh sách đơn hàng.");
      }
    };
    fetchOrderAndCustomer();
  }, [orderId, dealerId, getCustomerOrders]);

  useEffect(() => {
    if (CustomerOrder && CustomerOrder.length > 0) {
      const currentOrder = CustomerOrder.find((o) => o.orderId == orderId);
      if (currentOrder) {
        setOrderInfo(currentOrder);
        if (currentOrder.customerId) {
          getCustomerById(currentOrder.customerId);
        } else {
          console.warn("Order found, but no customerId associated.");
        }
      } else {
        console.warn(`Order with ID ${orderId} not found in the list.`);
      }
    }
  }, [orderId, CustomerOrder, getCustomerById]);

  useEffect(() => {
    if (Array.isArray(CustomerOrderDetail) && CustomerOrderDetail.length > 0) {
      const fetchVehicles = async () => {
        setIsLoadingVehicles(true);
        setError(null);
        try {
          const vehiclePromises = CustomerOrderDetail.map((item) =>
            fetchVehicleById(item.vehicleId)
          );

          const vehiclesData = await Promise.all(vehiclePromises);

          setVehicleDetails(vehiclesData.filter(Boolean));
        } catch (err) {
          console.error("Error fetching vehicle details:", err);
          setError("Không thể tải chi tiết một số xe.");
          setVehicleDetails([]);
        } finally {
          setIsLoadingVehicles(false);
        }
      };
      fetchVehicles();
    } else {
      setVehicleDetails([]);
    }
  }, [CustomerOrderDetail, fetchVehicleById]);

  useEffect(() => {
    let objectUrlsToRevoke = [];

    const fetchAllImages = async () => {
      if (vehicleDetails && vehicleDetails.length > 0) {
        const newImageUrls = { ...vehicleImageUrls };
        const pathsToFetch = vehicleDetails
          .map((v) => v?.variantImage)
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

    // Hàm cleanup: Thu hồi tất cả Object URL đã tạo trong useEffect này
    return () => {
      objectUrlsToRevoke.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      objectUrlsToRevoke = [];
    };
  }, [vehicleDetails]);

  // 6. Combine all data once available
  const mergedData = useMemo(() => {
    if (
      !orderInfo ||
      !CustomerDetail ||
      !Array.isArray(CustomerOrderDetail) ||
      CustomerOrderDetail.length === 0 ||
      vehicleDetails.length === 0 ||
      vehicleDetails.length !== CustomerOrderDetail.length
    ) {
      return null;
    }
    const itemsWithVehicles = CustomerOrderDetail.map((item) => {
      const vehicle = vehicleDetails.find(
        (v) => v.vehicleId === item.vehicleId
      );
      return {
        ...item,
        vehicle: vehicle || null,
      };
    });

    return {
      order: orderInfo,
      customer: CustomerDetail,
      items: itemsWithVehicles,
    };
  }, [orderInfo, CustomerDetail, CustomerOrderDetail, vehicleDetails]);

  const isLoading =
    isLoadingOrderDetail ||
    isLoadingCustomerDetail ||
    isLoadingCustomerOrder ||
    isLoadingVehicles ||
    !mergedData;
  const handlePayment = () => {
    toast.info(`Thực hiện thanh toán cho đơn hàng ${orderId}`);
  };

  const handleCancelOrder = () => {
    toast.warn(`Thực hiện huỷ đơn hàng ${orderId}`);
  };


  if (isLoading && !error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <Title level={4} type="danger">
          Lỗi tải dữ liệu
        </Title>
        <Text>{error}</Text>
        <Button onClick={() => navigate(-1)} style={{ marginTop: "16px" }}>
          Quay lại
        </Button>
      </Card>
    );
  }

  if (!mergedData) {
    return (
      <Card>
        <Title level={4}>Không tìm thấy chi tiết đơn hàng</Title>
        <Text>Không thể tìm thấy thông tin cho mã đơn hàng #{orderId}.</Text>
        <Button onClick={() => navigate(-1)} style={{ marginTop: "16px" }}>
          Quay lại
        </Button>
      </Card>
    );
  }

  const { order, customer, items } = mergedData;
  const isActionDisabled =
    order.status === "COMPLETED" || order.status === "CANCELLED"; 

  return (
    <div>
      {/* Button Quay lại */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/dealer-staff/orders")} //
        className="mb-4"
      >
        Quay lại danh sách
      </Button>

      {/* Header và nút Action */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Chi tiết đơn hàng: #{order.orderId}</Title>
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
        <Col span={10}>
          <Card title="Thông tin khách hàng">
            {customer ? (
              <Descriptions column={1} layout="horizontal">
                <Descriptions.Item label={<UserOutlined />}>
                  {customer.customerName}
                </Descriptions.Item>
                <Descriptions.Item label={<PhoneOutlined />}>
                  {customer.phone}
                </Descriptions.Item>
                <Descriptions.Item label={<MailOutlined />}>
                  {customer.email}
                </Descriptions.Item>
                <Descriptions.Item label={<HomeOutlined />}>
                  {customer.address || "Chưa có địa chỉ"}
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
                {/* Use correct field name and format */}
                {dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    isActionDisabled
                      ? order.status === "COMPLETED"
                        ? "success"
                        : "error"
                      : "processing"
                  }
                >
                  {order.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <Title level={3} style={{ color: "red" }}>
                  {(order.totalPrice || 0).toLocaleString("vi-VN")} VNĐ
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
              dataSource={items || []}
              renderItem={(item) => {
                // Lấy URL ảnh từ state, dựa vào path ảnh của xe
                const imageUrl = item.vehicle?.variantImage
                  ? vehicleImageUrls[item.vehicle.variantImage]
                  : null;
                // Xác định trạng thái loading cho ảnh này
                const isImageLoading =
                  item.vehicle?.variantImage &&
                  !(item.vehicle.variantImage in vehicleImageUrls);

                return (
                  <List.Item
                    actions={[
                      <Text strong>
                        {(item.price || 0).toLocaleString("vi-VN")} VNĐ
                      </Text>,
                      item.vehicle ? (
                        <Link
                          to={`/dealer-staff/vehicles/${item.vehicle.vehicleId}`}
                        >
                          Xem chi tiết xe
                        </Link>
                      ) : (
                        <Text type="secondary">Chi tiết xe không có</Text>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
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
                            <Image // Dùng Image để có preview
                              src={imageUrl}
                              alt={item.vehicle?.variantName}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              preview={true} // Bật preview
                            />
                          ) : (
                            <CarOutlined
                              style={{ fontSize: 32, color: "#999" }}
                            /> // Icon placeholder
                          )}
                        </div>
                      }
                      title={`${item.vehicle?.modelName || "N/A"} ${
                        item.vehicle?.variantName || "N/A"
                      }`} //
                      description={`Màu: ${
                        item.vehicle?.color || "N/A"
                      } - VIN: ${item.vehicle?.vinNumber || "N/A"}`} //
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
