// components/order/orderList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Space, Card, Typography, Spin, Tag, Modal } from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  CreditCardOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  ContainerOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDealerOrder from "../../../../hooks/useDealerOrder";
import useAuthen from "../../../../hooks/useAuthen";
import PaymentModal from "./PaymentModal.jsx";
import usePaymentStore from "../../../../hooks/usePayment.js";

const { Title, Text } = Typography;

export default function OrderList() {
  const navigate = useNavigate();
  const { userDetail } = useAuthen();
  const {
    CustomerOrder,
    isLoadingCustomerOrder,
    getCustomerOrders,
  } = useDealerOrder();
  const { payment, isLoadingPayment, getPayment } = usePaymentStore();
  const [mergedOrders, setMergedOrders] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  const dealerId = userDetail?.dealer?.dealerId;

  useEffect(() => {
    if (dealerId) {
      getCustomerOrders(dealerId);
      // 2. Đã loại bỏ getCustomer(dealerId)
      getPayment();
    }
  }, [getCustomerOrders, getPayment, dealerId]);

  const filteredOrders = useMemo(() => {
    return CustomerOrder.filter((order) => order.customerId == null);
  }, [CustomerOrder]);

  useEffect(() => {
    // 4. Đã loại bỏ check 'Customer'
    if (
      filteredOrders &&
      filteredOrders.length >= 0 &&
      payment &&
      payment.length >= 0
    ) {
      // 5. Đã loại bỏ 'customerMap'

      const paymentMap = new Map();
      payment.forEach((p) => {
        const currentTotal = paymentMap.get(p.orderId) || 0;

        if (p.status === "COMPLETED" || p.status === "Completed") {
          paymentMap.set(p.orderId, currentTotal + (p.amount || 0));
        }
      });
      const combinedData = filteredOrders.map((order) => {
        // 6. Đã loại bỏ 'const customer'
        const totalPaid = paymentMap.get(order.orderId) || 0;

        return {
          ...order,
          // 7. Thay thế 'customerName' bằng 'dealerName' từ userDetail
          dealerName: userDetail?.dealer?.dealerName || "N/A",
          totalPaid: totalPaid,
        };
      });
      setMergedOrders(combinedData);
    } else {
      setMergedOrders([]);
    }
  }, [filteredOrders, payment, userDetail]);

  const handleViewDetail = (orderId) => {
    navigate(`/dealer-manager/dealer-orders/${orderId}`);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrderForPayment(null);
    if (dealerId) {
      getCustomerOrders(dealerId);
      getPayment();
    }
  };

  const handlePayment = (record) => {
    // 9. Cập nhật record để truyền cho PaymentModal
    // PaymentModal mong đợi trường 'customerName', nên ta gán 'dealerName' cho nó
    const orderForModal = {
      ...record,
      customerName: record.dealerName || "Đơn hàng nội bộ",
    };
    setSelectedOrderForPayment(orderForModal);
    setIsPaymentModalOpen(true);
  };

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId - b.orderId,
    },
    // 10. THAY ĐỔI CỘT
    {
      title: "Đại lý", // Thay vì "Khách hàng"
      dataIndex: "dealerName", // Thay vì "customerName"
      key: "dealerName", // Thay vì "customerName"
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền (VNĐ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => `${(amount || 0).toLocaleString("vi-VN")}`,
    },
    {
      title: "Đã thanh toán (VNĐ)",
      dataIndex: "totalPaid",
      key: "totalPaid",
      render: (amount) => (
        <Text type="success">{`${(amount || 0).toLocaleString("vi-VN")}`}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "processing";
        let text = status;
        if (status === "COMPLETED") {
          color = "success";
          text = "Hoàn thành";
        }
        if (status === "PAID") {
          color = "blue";
          text = "Đã thanh toán";
        }
        if (status === "PARTIAL") {
          color = "orange";
          text = "Thanh toán một phần";
        }
        if (status === "CANCELLED") {
          color = "error";
          text = "Đã hủy";
        }
        if (status === "PENDING") {
          color = "warning";
          text = "Đang chờ";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.orderId)}
          >
            Chi tiết
          </Button>
          <Button
            type="default"
            icon={<CreditCardOutlined />}
            size="small"
            onClick={() => handlePayment(record)}
            disabled={
              record.status === "COMPLETED" ||
              record.status === "CANCELLED" ||
              record.status === "PAID" ||
              record.status === "PARTIAL"
            }
          >
            Thanh toán
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <ContainerOutlined style={{ marginRight: 8 }} /> Đơn hàng cần thanh
          toán
        </Title>
      </div>

      <Card>
        {isLoadingCustomerOrder ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={mergedOrders}
            rowKey="orderId"
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        order={selectedOrderForPayment}
      />
    </div>
  );
}
