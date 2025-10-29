// components/order/orderList.jsx
import React, { useEffect, useState } from "react";
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

const { Title } = Typography;

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [mergedOrders, setMergedOrders] = useState([]);

  const dealerId = userDetail?.dealer?.dealerId;

  useEffect(() => {
    if (dealerId) {
      getCustomerOrders(dealerId);
      getCustomer(dealerId);
    }
  }, [getCustomerOrders, getCustomer, dealerId]);

  const filteredOrders = React.useMemo(() => {
    return CustomerOrder.filter((order) => order.customerId != null);
  }, [CustomerOrder]);

  useEffect(() => {
    // Chỉ chạy khi CÓ cả 2 nguồn dữ liệu
    if (filteredOrders.length > 0 && Customer && Customer.length > 0) {
      const customerMap = new Map(
        Customer.map((customer) => [customer.customerId, customer])
      );
      const combinedData = filteredOrders.map((order) => {
        const customer = customerMap.get(order.customerId);
        return {
          ...order,
          customerName: customer ? customer.customerName : "N/A",
        };
      });
      setMergedOrders(combinedData);
    } else {
      setMergedOrders(filteredOrders);
    }
  }, [filteredOrders, Customer]);

  const handleViewDetail = (orderId) => {
    navigate(`/dealer-staff/orders/${orderId}`);
  };

  const handlePayment = (record) => {
    // Logic thanh toán
    toast.info(`Thực hiện thanh toán cho đơn hàng ${record.orderId}`);
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

  // const handleCreateQuote = (record) => {
  //   navigate(
  //     `/dealer-staff/quote/${record.orderId}?customerId=${record.customerId}`
  //   );
  // };

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
              record.status === "COMPLETED" || record.status === "CANCELLED"
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
              record.status === "COMPLETED" || record.status === "CANCELLED"
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
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
