import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Spin,
  Tag,
  DatePicker,
  Select,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckSquareOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDealerRequest from "../../../../hooks/useDealerRequest";
import useAuthen from "../../../../hooks/useAuthen";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function RequestList() {
  const navigate = useNavigate();
  const {
    requestLists,
    isLoading,
    fetchRequestsByDealer,
    confirmRequestReceived,
    isLoadingConfirmRequest,
  } = useDealerRequest();
  const { userDetail } = useAuthen();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [confirmForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
  });

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter data when filters change
  useEffect(() => {
    filterData();
  }, [requestLists, searchText, statusFilter, dateRange]);

  const loadData = async () => {
    const dealerId = userDetail?.dealer?.dealerId;

    if (!dealerId) {
      toast.error("Không tìm thấy thông tin đại lý", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await fetchRequestsByDealer(dealerId);
    } catch (error) {
      toast.error("Không thể tải danh sách yêu cầu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const filterData = () => {
    let filtered = [...requestLists];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.requestId?.toString().includes(searchText) ||
          item.notes?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter && statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter((item) => {
        const requestDate = dayjs(item.requestDate);
        return (
          requestDate.isAfter(dateRange[0]) &&
          requestDate.isBefore(dateRange[1])
        );
      });
    }

    setFilteredData(filtered);
  };

  const handleViewDetail = (requestId) => {
    navigate(`/dealer-manager/request-list/${requestId}`);
  };

  const handleRefresh = () => {
    setSearchText("");
    setStatusFilter("ALL");
    setDateRange(null);
    loadData();
  };

  const showConfirmModal = (record) => {
    setSelectedRequest(record);
    confirmForm.setFieldsValue({
      confirmerName: userDetail?.fullName || "N/A",
    });
    setIsConfirmModalVisible(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await confirmRequestReceived(selectedRequest.requestId);
      if (response && response.status === 200) {
        toast.success("Xác nhận đã nhận xe thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsConfirmModalVisible(false);
        loadData(); // Refresh danh sách
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xác nhận thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancelRequest = async () => {};

  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
    confirmForm.resetFields();
  };

  // Calculate statistics
  const stats = {
    total: requestLists.length,
    pending: requestLists.filter((r) => r.status === "PENDING").length,
    approved: requestLists.filter((r) => r.status === "APPROVED").length,
    rejected: requestLists.filter((r) => r.status === "REJECTED").length,
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      PENDING: {
        color: "warning",
        icon: <ClockCircleOutlined />,
        text: "Chờ duyệt",
      },
      APPROVED: {
        color: "processing",
        icon: <CheckCircleOutlined />,
        text: "Đã duyệt",
      },
      REJECTED: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Từ chối",
      },
      SHIPPED: {
        color: "blue",
        icon: <CheckCircleOutlined spin />,
        text: "Đang vận chuyển",
      },
      DELIVERED: {
        color: "success",
        icon: <CheckOutlined />,
        text: "Hoàn thành",
      },
    };

    const config = statusConfig[status] || { color: "default", text: status };

    return (
      <Tag
        color={config.color}
        icon={config.icon}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {config.text}
      </Tag>
    );
  };

  const getPriorityTag = (priority) => {
    const priorityConfig = {
      HIGH: { color: "red", text: "Cao" },
      NORMAL: { color: "blue", text: "Bình thường" },
      LOW: { color: "green", text: "Thấp" },
    };

    const config = priorityConfig[priority] || {
      color: "default",
      text: priority,
    };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestId",
      key: "requestId",
      width: 120,
      fixed: "left",
      sorter: (a, b) => a.requestId - b.requestId,
      render: (id) => <span className="font-semibold">#{id}</span>,
    },
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      width: 180,
      ellipsis: true,
      render: (text, record) => record.dealerName || "N/A",
    },
    {
      title: "Người tạo",
      dataIndex: "userFullName",
      key: "userFullName",
      width: 150,
      render: (text, record) => record.userFullName || "N/A",
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "requestDate",
      key: "requestDate",
      width: 150,
      sorter: (a, b) => new Date(a.requestDate) - new Date(b.requestDate),
      render: (date) => (
        <span>{date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"}</span>
      ),
    },
    {
      title: "Ngày cần xe",
      dataIndex: "requiredDate",
      key: "requiredDate",
      width: 130,
      render: (date) => (
        <span>{date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}</span>
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      filters: [
        { text: "Cao", value: "HIGH" },
        { text: "Bình thường", value: "NORMAL" },
        { text: "Thấp", value: "LOW" },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => getPriorityTag(priority),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Số lượng xe",
      key: "totalQuantity",
      width: 140,
      align: "center",
      render: (_, record) => {
        const total =
          record.requestDetails?.reduce(
            (sum, detail) => sum + (detail.quantity || 0),
            0
          ) || 0;
        return <span className="font-semibold">{total}</span>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0),
      render: (amount) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.requestId)}
          >
            Chi tiết
          </Button>
          {record.status === "PENDING" && (
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              onClick={() => showConfirmModal(record)}
            >
              Huỷ
            </Button>
          )}
          {record.status === "SHIPPED" && (
            <Button
              type="primary"
              style={{ backgroundColor: "#52c41a" }}
              icon={<CheckSquareOutlined />}
              size="small"
              onClick={() => showConfirmModal(record)}
            >
              Đã nhận
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center m-0">
          <FileTextOutlined style={{ marginRight: 8 }} />
          Danh sách yêu cầu xe
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        >
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Tổng yêu cầu"
              value={stats.total}
              valueStyle={{ color: "#1890ff" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm kiếm theo mã yêu cầu hoặc ghi chú"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              suffixIcon={<FilterOutlined />}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Từ chối</Option>
              <Option value="SHIPPED">Đang vận chuyển</Option>
              <Option value="ALLOCATED">Đã phân bổ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={10}>
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              value={dateRange}
              onChange={setDateRange}
            />
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="requestId"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: "Không có yêu cầu nào",
            }}
          />
        )}
      </Card>

      {/* Modal xác nhận đã nhận xe */}
      <Modal
        title="Xác nhận đã nhận xe"
        open={isConfirmModalVisible}
        onOk={handleConfirm}
        onCancel={handleConfirmCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={isLoadingConfirmRequest}
        okButtonProps={{ icon: <CheckSquareOutlined /> }}
      >
        <Form form={confirmForm} layout="vertical">
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>Mã yêu cầu:</strong> #{selectedRequest?.requestId}
            </p>
            <p>
              <strong>Đại lý:</strong> {selectedRequest?.dealerName}
            </p>
            <p>
              <strong>Số lượng xe:</strong>{" "}
              {selectedRequest?.requestDetails?.reduce(
                (sum, detail) => sum + (detail.quantity || 0),
                0
              ) || 0}
            </p>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              {formatCurrency(selectedRequest?.totalAmount)}
            </p>
          </div>

          <Form.Item
            name="confirmerName"
            label="Người xác nhận"
            rules={[
              { required: true, message: "Vui lòng nhập tên người xác nhận" },
            ]}
          >
            <Input placeholder="Nhập tên người xác nhận" disabled />
          </Form.Item>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#e6f7ff",
              borderRadius: 4,
            }}
          >
            <p style={{ margin: 0, color: "#0958d9" }}>
              ℹ️ Xác nhận rằng đại lý đã nhận đầy đủ xe từ nhà sản xuất
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
