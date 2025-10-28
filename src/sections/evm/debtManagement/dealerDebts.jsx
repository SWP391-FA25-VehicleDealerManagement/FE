import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Typography,
  Spin,
  Modal,
  Form,
  Select,
  InputNumber,
  Descriptions,
  Row,
  Col,
  Statistic,
  DatePicker,
} from "antd";
import {
  DollarOutlined,
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ShopOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useDealerDebt from "../../../hooks/useDealerDebt";
import useDealerStore from "../../../hooks/useDealer";

const { Title, Text } = Typography;

export default function DealerDebts() {
  const [isDebtLoading, setIsDebtLoading] = useState(false);
  const { fetchDealerDebt, dealerDebt } = useDealerDebt();
  const {
    fetchDealers,
    dealers,
    isLoading: isDealerLoading,
  } = useDealerStore();
  const [mergedData, setMergedData] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsDebtLoading(true);
      await fetchDealerDebt();
      await fetchDealers();
      setIsDebtLoading(false);
    };
    loadData();
  }, [fetchDealerDebt, fetchDealers]);

  // USEEFFECT ĐỂ KẾT HỢP DỮ LIỆU KHI CÓ THAY ĐỔI
  useEffect(() => {
    // Dùng 'DealerDebts' (từ hook) và 'dealers' (từ store)
    if (dealerDebt && dealers) {
      const dealerMap = new Map(
        dealers.map((dealer) => [dealer.dealerId, dealer])
      );

      // Kết hợp dữ liệu
      const combinedData = dealerDebt.map((debt) => {
        const dealer = dealerMap.get(Number(debt.dealerId));

        return {
          ...debt,
          dealerName: dealer ? dealer.dealerName : "Không tìm thấy",
          phone: dealer ? dealer.phone : "N/A",
          address: dealer ? dealer.address : "N/A",
        };
      });

      setMergedData(combinedData);
    } else {
      setMergedData([]);
    }
  }, [dealerDebt, dealers]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Mã",
      dataIndex: "debtId",
      key: "debtId",
      width: 130,
      ...getColumnSearchProps("debtId"),
    },
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      width: "10%",
      ...getColumnSearchProps("dealerName"),
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 110,
    },
    {
      title: "Ngày bắt đầu nợ",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"), // Thêm kiểm tra
      sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "amountDue",
      key: "amountDue",
      width: 150,
      render: (text, record) => {
        const value = record.totalAmount || record.amountDue || 0;
        return `${value.toLocaleString("vi-VN")} đ`;
      },
      sorter: (a, b) =>
        (a.totalAmount || a.amountDue || 0) -
        (b.totalAmount || b.amountDue || 0),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "amountPaid",
      key: "amountPaid",
      width: 140,
      render: (text, record) => {
        const value = record.paidAmount || record.amountPaid || 0;
        return (
          <Text type="success">{`${value.toLocaleString("vi-VN")} đ`}</Text>
        );
      },
      sorter: (a, b) =>
        (a.paidAmount || a.amountPaid || 0) -
        (b.paidAmount || b.amountPaid || 0),
    },
    {
      title: "Còn nợ",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      width: 150,
      render: (remainingAmount) => {
        const value = remainingAmount || 0;
        return (
          <Text type="danger" strong>{`${value.toLocaleString(
            "vi-VN"
          )} đ`}</Text>
        );
      },
      sorter: (a, b) => (a.remainingAmount || 0) - (b.remainingAmount || 0), // Sửa: Xử lý giá trị 0
    },
    {
      title: "Tổng lãi",
      dataIndex: "totalInterest",
      key: "totalInterest",
      width: 130,
      render: (value) => {
        const val = value || 0;
        return <Text type="warning">{`${val.toLocaleString("vi-VN")} đ`}</Text>;
      },
      sorter: (a, b) => (a.totalInterest || 0) - (b.totalInterest || 0),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 130,
      render: (date, record) => {
        return (
          <div>
            <Text type="default">{dayjs(date).format("DD/MM/YYYY")}</Text>
          </div>
        );
      },
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(), //
    },
    {
      title: "Hình thức trả",
      dataIndex: "paymentType",
      key: "paymentType",
      width: 120,
      render: (type) => {
        if (type === "INSTALLMENT") return <Tag color="blue">Trả góp</Tag>;
        if (type === "FULL") return <Tag color="green">Trả hết</Tag>;
        return <Tag>{type}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const statusConfig = {
          paid: {
            color: "success",
            text: "Đã thanh toán đủ",
            icon: <CheckCircleOutlined />,
          },
          partial: {
            color: "processing",
            text: "Thanh toán 1 phần",
            icon: <ClockCircleOutlined />,
          },
          PENDING: {
            color: "warning",
            text: "Chưa thanh toán",
            icon: <ExclamationCircleOutlined />,
          },
          OVERDUE: {
            color: "error",
            text: "Quá hạn",
            icon: <WarningOutlined />,
          },
          ACTIVE: {
            color: "processing",
            text: "Đang hoạt động",
            icon: <ClockCircleOutlined />,
          },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: "Đã thanh toán đủ", value: "paid" },
        { text: "Thanh toán 1 phần", value: "partial" },
        { text: "Chưa thanh toán", value: "pending" },
        { text: "Quá hạn", value: "overdue" },
        { text: "Đang hoạt động", value: "ACTIVE" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/evm-staff/debts/${record.debtId}`)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      totalDebt: mergedData.reduce(
        (sum, d) => sum + (d.totalAmount || d.amountDue || 0),
        0
      ),
      totalPaid: mergedData.reduce((sum, d) => sum + (d.paidAmount || 0), 0),
      totalRemaining: mergedData.reduce(
        (sum, d) => sum + (d.remainingAmount || 0),
        0
      ),
      overdueCount: mergedData.filter(
        (d) => d.status === "overdue" || d.overdue === true
      ).length,
    };
  }, [mergedData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <DollarOutlined style={{ marginRight: 8 }} /> Công nợ của đại lý
        </Title>
        <Space>
          <Text type="secondary">Theo dõi công nợ đại lý với hãng xe</Text>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng tiền hàng đã giao"
              value={stats.totalDebt}
              prefix={<FileTextOutlined />}
              suffix="đ"
              precision={0}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đại lý đã thanh toán"
              value={stats.totalPaid}
              prefix={<CheckCircleOutlined />}
              suffix="đ"
              precision={0}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đại lý còn nợ"
              value={stats.totalRemaining}
              prefix={<DollarOutlined />}
              suffix="đ"
              precision={0}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số phiếu quá hạn"
              value={stats.overdueCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {isDebtLoading || isDealerLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={mergedData}
            rowKey="debtId"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 2000 }}
          />
        )}
      </Card>
    </div>
  );
}
