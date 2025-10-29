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
import CreateOrderModal from "./createOrderModal";
import CreateQuoteModal from "./CreateQuoteModal.jsx";
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
    getCustomer,
    Customer,
    isLoadingCustomer,
  } = useDealerOrder();
  const { payment, isLoadingPayment, getPayment } = usePaymentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [mergedOrders, setMergedOrders] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  const dealerId = userDetail?.dealer?.dealerId;

  const loadData = () => {
    if (dealerId) {
      getCustomerOrders(dealerId);
      getCustomer(dealerId);
      getPayment();
    }
  };

  useEffect(() => {
    loadData();
  }, [getCustomerOrders, getCustomer, getPayment, dealerId]);

  const filteredOrders = useMemo(() => {
    return CustomerOrder.filter(
      (order) => order.customerId !== null && order.customerId !== undefined
    );
  }, [CustomerOrder]);

  useEffect(() => {
    if (
      filteredOrders &&
      filteredOrders.length >= 0 &&
      Customer &&
      Customer.length > 0 &&
      payment &&
      payment.length >= 0
    ) {
      const customerMap = new Map(
        Customer.map((customer) => [customer.customerId, customer])
      );

      const paymentMap = new Map();
      payment.forEach((p) => {
        const currentTotal = paymentMap.get(p.orderId) || 0;

        if (p.status === "COMPLETED" || p.status === "Completed") {
          paymentMap.set(p.orderId, currentTotal + (p.amount || 0));
        }
      });
      const combinedData = filteredOrders.map((order) => {
        const customer = customerMap.get(order.customerId);
        const totalPaid = paymentMap.get(order.orderId) || 0;

        return {
          ...order,
          customerName: customer ? customer.customerName : "N/A", //
          totalPaid: totalPaid,
        };
      });
      setMergedOrders(combinedData);
    } else {
      setMergedOrders([]);
    }
  }, [filteredOrders, Customer, payment]);

  const handleViewDetail = (orderId) => {
    navigate(`/dealer-staff/orders/${orderId}`);
  };

  const handlePayment = (record) => {
    setSelectedOrderForPayment(record);
    setIsPaymentModalOpen(true);
  };

  const handleCancelOrder = (record) => {
    // Logic huỷ đơn
    Modal.confirm({
      title: "Xác nhận huỷ đơn hàng",
      content: `Bạn có chắc muốn huỷ đơn hàng ${record.orderId}?`,
      okText: "Xác nhận",
      cancelText: "Không",
      onOk: () => {
        // Gọi API huỷ đơn...
        toast.success(`Đã huỷ đơn hàng ${record.orderId}`);
      },
    });
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrderForPayment(null);
    loadData();
  };

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
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
          <Button
            danger
            icon={<CloseCircleOutlined />}
            size="small"
            onClick={() => handleCancelOrder(record)}
            disabled={
              record.status === "COMPLETED" ||
              record.status === "CANCELLED" ||
              record.status === "PAID" ||
              record.status === "PARTIAL"
            }
          >
            Huỷ đơn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <ContainerOutlined style={{ marginRight: 8 }} /> Quản lý đơn hàng
        </Title>
        <div className="flex space-x-4">
          <Button
            type="primary"
            icon={<FormOutlined />}
            onClick={() => setIsQuoteModalOpen(true)}
            disabled={isLoadingCustomer}
          >
            Tạo Báo Giá
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoadingCustomer}
          >
            Tạo đơn hàng mới
          </Button>
        </div>
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

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={() => {
          if (dealerId) {
            getCustomerOrders(dealerId);
          }
          setIsModalOpen(false);
        }}
      />

      <CreateQuoteModal
        isOpen={isQuoteModalOpen}
        onOrderCreated={() => {
          loadData();
          setIsModalOpen(false);
        }}
      />
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        order={selectedOrderForPayment}
      />
    </div>
  );
}
