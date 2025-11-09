import React, { useState, useEffect } from "react";
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
  DatePicker,
  InputNumber,
  Descriptions,
  Tabs,
  Progress,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function ContractsTargets() {
  const [activeTab, setActiveTab] = useState("contracts");
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [targets, setTargets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();
  const [targetForm] = Form.useForm();

  // Mock data - thay bằng API call thực tế
  useEffect(() => {
    fetchContracts();
    fetchTargets();
  }, []);

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockContracts = [
        {
          contractId: 1,
          contractNumber: "HĐ-2025-001",
          dealerId: 1,
          dealerName: "Đại lý Toyota Hà Nội",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          contractValue: 5000000000,
          status: "active",
          paymentTerms: "Thanh toán trong vòng 30 ngày",
          createdDate: "2024-12-15",
        },
        {
          contractId: 2,
          contractNumber: "HĐ-2025-002",
          dealerId: 2,
          dealerName: "Đại lý Honda TP.HCM",
          startDate: "2025-02-01",
          endDate: "2026-01-31",
          contractValue: 7500000000,
          status: "active",
          paymentTerms: "Thanh toán trong vòng 45 ngày",
          createdDate: "2025-01-20",
        },
        {
          contractId: 3,
          contractNumber: "HĐ-2024-015",
          dealerId: 3,
          dealerName: "Đại lý Ford Đà Nẵng",
          startDate: "2024-06-01",
          endDate: "2024-12-31",
          contractValue: 3000000000,
          status: "expired",
          paymentTerms: "Thanh toán trong vòng 30 ngày",
          createdDate: "2024-05-10",
        },
      ];
      setContracts(mockContracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Không thể tải danh sách hợp đồng");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTargets = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockTargets = [
        {
          targetId: 1,
          dealerId: 1,
          dealerName: "Đại lý Toyota Hà Nội",
          period: "Q1 2025",
          targetRevenue: 2000000000,
          actualRevenue: 1500000000,
          targetUnits: 100,
          actualUnits: 75,
          achievement: 75,
          status: "in_progress",
        },
        {
          targetId: 2,
          dealerId: 2,
          dealerName: "Đại lý Honda TP.HCM",
          period: "Q1 2025",
          targetRevenue: 3000000000,
          actualRevenue: 3200000000,
          targetUnits: 150,
          actualUnits: 160,
          achievement: 106.67,
          status: "achieved",
        },
        {
          targetId: 3,
          dealerId: 3,
          dealerName: "Đại lý Ford Đà Nẵng",
          period: "Q4 2024",
          targetRevenue: 1500000000,
          actualRevenue: 1200000000,
          targetUnits: 80,
          actualUnits: 65,
          achievement: 80,
          status: "not_achieved",
        },
      ];
      setTargets(mockTargets);
    } catch (error) {
      console.error("Error fetching targets:", error);
      toast.error("Không thể tải danh sách mục tiêu");
    } finally {
      setIsLoading(false);
    }
  };

  const showAddContractModal = () => {
    setModalMode("add");
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditContractModal = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    form.setFieldsValue({
      contractNumber: record.contractNumber,
      dealerId: record.dealerId,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
      contractValue: record.contractValue,
      paymentTerms: record.paymentTerms,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  const handleContractSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Contract values:", values);
      
      // TODO: Implement API call
      toast.success(
        modalMode === "add"
          ? "Thêm hợp đồng thành công"
          : "Cập nhật hợp đồng thành công"
      );
      setIsModalOpen(false);
      form.resetFields();
      fetchContracts();
    } catch (error) {
      console.error("Error submitting contract:", error);
    }
  };

  const showAddTargetModal = () => {
    setModalMode("add");
    targetForm.resetFields();
    setIsTargetModalOpen(true);
  };

  const showEditTargetModal = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    targetForm.setFieldsValue({
      dealerId: record.dealerId,
      period: record.period,
      targetRevenue: record.targetRevenue,
      targetUnits: record.targetUnits,
    });
    setIsTargetModalOpen(true);
  };

  const handleTargetSubmit = async () => {
    try {
      const values = await targetForm.validateFields();
      console.log("Target values:", values);
      
      // TODO: Implement API call
      toast.success(
        modalMode === "add"
          ? "Thêm mục tiêu thành công"
          : "Cập nhật mục tiêu thành công"
      );
      setIsTargetModalOpen(false);
      targetForm.resetFields();
      fetchTargets();
    } catch (error) {
      console.error("Error submitting target:", error);
    }
  };

  const handleDeleteContract = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa hợp đồng",
      content: `Bạn có chắc chắn muốn xóa hợp đồng ${record.contractNumber}?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // TODO: Implement API call
          toast.success("Xóa hợp đồng thành công");
          fetchContracts();
        } catch (error) {
          toast.error("Xóa hợp đồng thất bại");
        }
      },
    });
  };

  const contractColumns = [
    {
      title: "Số HĐ",
      dataIndex: "contractNumber",
      key: "contractNumber",
      width: 150,
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      width: 200,
    },
    {
      title: "Thời hạn",
      key: "duration",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="text-sm">
            {dayjs(record.startDate).format("DD/MM/YYYY")}
          </div>
          <div className="text-xs text-gray-500">
            đến {dayjs(record.endDate).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Giá trị HĐ",
      dataIndex: "contractValue",
      key: "contractValue",
      width: 150,
      render: (value) => (
        <span className="font-semibold text-green-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value)}
        </span>
      ),
    },
    {
      title: "Điều khoản thanh toán",
      dataIndex: "paymentTerms",
      key: "paymentTerms",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const statusConfig = {
          active: { color: "green", text: "Đang hoạt động", icon: <CheckCircleOutlined /> },
          pending: { color: "orange", text: "Chờ duyệt", icon: <ClockCircleOutlined /> },
          expired: { color: "default", text: "Hết hạn", icon: <ExclamationCircleOutlined /> },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showContractDetail(record)}
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditContractModal(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteContract(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const showContractDetail = (record) => {
    Modal.info({
      title: "Chi tiết hợp đồng",
      width: 700,
      content: (
        <Descriptions bordered column={1} style={{ marginTop: 16 }}>
          <Descriptions.Item label="Số hợp đồng">{record.contractNumber}</Descriptions.Item>
          <Descriptions.Item label="Đại lý">{record.dealerName}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {dayjs(record.startDate).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {dayjs(record.endDate).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Giá trị hợp đồng">
            {record.contractValue.toLocaleString("vi-VN")} đ
          </Descriptions.Item>
          <Descriptions.Item label="Điều khoản thanh toán">
            {record.paymentTerms}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(record.createdDate).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={record.status === "active" ? "success" : "default"}>
              {record.status === "active" ? "Đang hoạt động" : "Hết hạn"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      ),
    });
  };

  // Statistics
  const contractStats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "active").length,
    totalValue: contracts.reduce((sum, c) => sum + c.contractValue, 0),
  };


  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-2">
          <FileTextOutlined className="mr-2" />
          Hợp đồng & Mục tiêu Đại lý
        </Title>
        <p className="text-gray-500">
          Quản lý hợp đồng hợp tác và mục tiêu kinh doanh với các đại lý
        </p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Contracts Tab */}
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Hợp đồng đại lý
            </span>
          }
          key="contracts"
        >
          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={8}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Tổng số hợp đồng</span>}
                  value={contractStats.total}
                  prefix={<FileTextOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#1890ff", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Hợp đồng đang hoạt động</span>}
                  value={contractStats.active}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Tổng giá trị hợp đồng</span>}
                  value={contractStats.totalValue}
                  prefix={<DollarOutlined className="text-orange-500" />}
                  formatter={(value) =>
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(value)
                  }
                  valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 max-w-2xl">
                <Input
                  placeholder="Tìm kiếm theo số HĐ, đại lý..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="large"
                  allowClear
                />
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddContractModal}
                size="large"
                className="ml-4"
              >
                Thêm hợp đồng
              </Button>
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              size="large"
              style={{ width: 250 }}
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "active", label: "🟢 Đang hoạt động" },
                { value: "pending", label: "🟠 Chờ duyệt" },
                { value: "expired", label: "⚪ Hết hạn" },
              ]}
            />
          </div>

          <Table
            columns={contractColumns}
            dataSource={contracts.filter((contract) => {
              const searchLower = searchText.toLowerCase();
              const matchSearch =
                contract.contractNumber?.toLowerCase().includes(searchLower) ||
                contract.dealerName?.toLowerCase().includes(searchLower);
              const matchStatus =
                statusFilter === "all" || contract.status === statusFilter;
              return matchSearch && matchStatus;
            })}
            rowKey="contractId"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} hợp đồng`,
            }}
            scroll={{ x: 1200 }}
            rowClassName={(record) =>
              record.status === "pending" ? "bg-orange-50" : ""
            }
          />
        </TabPane>
      </Tabs>

      {/* Contract Modal */}
      <Modal
        title={modalMode === "add" ? "Thêm hợp đồng mới" : "Chỉnh sửa hợp đồng"}
        open={isModalOpen}
        onOk={handleContractSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={700}
        okText={modalMode === "add" ? "Thêm" : "Cập nhật"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="contractNumber"
            label="Số hợp đồng"
            rules={[{ required: true, message: "Vui lòng nhập số hợp đồng" }]}
          >
            <Input placeholder="VD: HĐ-2025-001" />
          </Form.Item>

          <Form.Item
            name="dealerId"
            label="Đại lý"
            rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
          >
            <Select placeholder="Chọn đại lý">
              <Option value={1}>Đại lý Toyota Hà Nội</Option>
              <Option value={2}>Đại lý Honda TP.HCM</Option>
              <Option value={3}>Đại lý Ford Đà Nẵng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời hạn hợp đồng"
            rules={[{ required: true, message: "Vui lòng chọn thời hạn" }]}
          >
            <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="contractValue"
            label="Giá trị hợp đồng (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá trị hợp đồng" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="5000000000"
            />
          </Form.Item>

          <Form.Item
            name="paymentTerms"
            label="Điều khoản thanh toán"
            rules={[{ required: true, message: "Vui lòng nhập điều khoản" }]}
          >
            <Input.TextArea rows={3} placeholder="VD: Thanh toán trong vòng 30 ngày" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Đang hoạt động</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="expired">Hết hạn</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Target Modal */}
      <Modal
        title={modalMode === "add" ? "Thêm mục tiêu mới" : "Chỉnh sửa mục tiêu"}
        open={isTargetModalOpen}
        onOk={handleTargetSubmit}
        onCancel={() => {
          setIsTargetModalOpen(false);
          targetForm.resetFields();
        }}
        width={600}
        okText={modalMode === "add" ? "Thêm" : "Cập nhật"}
        cancelText="Hủy"
      >
        <Form form={targetForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="dealerId"
            label="Đại lý"
            rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
          >
            <Select placeholder="Chọn đại lý">
              <Option value={1}>Đại lý Toyota Hà Nội</Option>
              <Option value={2}>Đại lý Honda TP.HCM</Option>
              <Option value={3}>Đại lý Ford Đà Nẵng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="period"
            label="Kỳ"
            rules={[{ required: true, message: "Vui lòng nhập kỳ" }]}
          >
            <Input placeholder="VD: Q1 2025, Tháng 01/2025" />
          </Form.Item>

          <Form.Item
            name="targetRevenue"
            label="Mục tiêu doanh thu (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập mục tiêu doanh thu" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="2000000000"
            />
          </Form.Item>

          <Form.Item
            name="targetUnits"
            label="Mục tiêu số xe bán"
            rules={[{ required: true, message: "Vui lòng nhập mục tiêu số xe" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="100"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
