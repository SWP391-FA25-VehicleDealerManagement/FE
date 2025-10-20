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
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

export default function DealerDebts() {
  const [isLoading, setIsLoading] = useState(false);
  const [debts, setDebts] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [form] = Form.useForm();

  // Mock data - thay bằng API call thực tế
  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockDebts = [
        {
          debtId: 1,
          dealerId: 1,
          dealerName: "Đại lý Toyota Hà Nội",
          contactPerson: "Nguyễn Văn A",
          phone: "0901234567",
          invoiceNumber: "PN-2025-001",
          orderDate: "2025-01-15",
          totalAmount: 5000000000,
          paidAmount: 3000000000,
          remainingAmount: 2000000000,
          dueDate: "2025-03-31",
          daysPastDue: 15,
          status: "overdue",
          items: [
            { vehicleName: "Toyota Vios G", quantity: 30, unitPrice: 100000000, total: 3000000000 },
            { vehicleName: "Toyota Camry 2.5Q", quantity: 20, unitPrice: 100000000, total: 2000000000 },
          ],
          paymentHistory: [
            { date: "2025-01-20", amount: 1500000000, note: "Thanh toán lần 1" },
            { date: "2025-02-10", amount: 1500000000, note: "Thanh toán lần 2" },
          ],
        },
        {
          debtId: 2,
          dealerId: 2,
          dealerName: "Đại lý Honda TP.HCM",
          contactPerson: "Trần Thị B",
          phone: "0912345678",
          invoiceNumber: "PN-2025-002",
          orderDate: "2025-02-01",
          totalAmount: 7500000000,
          paidAmount: 7500000000,
          remainingAmount: 0,
          dueDate: "2025-03-15",
          daysPastDue: 0,
          status: "paid",
          items: [
            { vehicleName: "Honda City RS", quantity: 40, unitPrice: 120000000, total: 4800000000 },
            { vehicleName: "Honda CR-V", quantity: 15, unitPrice: 180000000, total: 2700000000 },
          ],
          paymentHistory: [
            { date: "2025-02-15", amount: 3750000000, note: "Thanh toán 50%" },
            { date: "2025-03-10", amount: 3750000000, note: "Thanh toán full" },
          ],
        },
        {
          debtId: 3,
          dealerId: 3,
          dealerName: "Đại lý Ford Đà Nẵng",
          contactPerson: "Lê Văn C",
          phone: "0923456789",
          invoiceNumber: "PN-2025-003",
          orderDate: "2025-03-01",
          totalAmount: 3000000000,
          paidAmount: 0,
          remainingAmount: 3000000000,
          dueDate: "2025-04-30",
          daysPastDue: 0,
          status: "pending",
          items: [
            { vehicleName: "Ford Ranger Wildtrak", quantity: 15, unitPrice: 200000000, total: 3000000000 },
          ],
          paymentHistory: [],
        },
        {
          debtId: 4,
          dealerId: 1,
          dealerName: "Đại lý Toyota Hà Nội",
          contactPerson: "Nguyễn Văn A",
          phone: "0901234567",
          invoiceNumber: "PN-2025-004",
          orderDate: "2025-04-01",
          totalAmount: 4500000000,
          paidAmount: 2000000000,
          remainingAmount: 2500000000,
          dueDate: "2025-05-15",
          daysPastDue: 0,
          status: "partial",
          items: [
            { vehicleName: "Toyota Innova E", quantity: 25, unitPrice: 180000000, total: 4500000000 },
          ],
          paymentHistory: [
            { date: "2025-04-10", amount: 2000000000, note: "Đặt cọc" },
          ],
        },
      ];
      setDebts(mockDebts);
    } catch (error) {
      console.error("Error fetching debts:", error);
      toast.error("Không thể tải danh sách công nợ");
    } finally {
      setIsLoading(false);
    }
  };

  const showPaymentModal = (record) => {
    setSelectedDebt(record);
    setIsDetailModalOpen(true);
  };

  const handleRemindPayment = (record) => {
    Modal.confirm({
      title: "Gửi nhắc nhở thanh toán",
      content: (
        <div>
          <p>Gửi nhắc nhở thanh toán đến <strong>{record.dealerName}</strong>?</p>
          <p>Số tiền còn lại: <Text type="danger" strong>{record.remainingAmount.toLocaleString("vi-VN")} đ</Text></p>
          <p>Hạn thanh toán: {dayjs(record.dueDate).format("DD/MM/YYYY")}</p>
        </div>
      ),
      okText: "Gửi nhắc nhở",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          // TODO: Implement API call to send reminder
          toast.success("Đã gửi nhắc nhở thanh toán đến đại lý");
        } catch (error) {
          toast.error("Gửi nhắc nhở thất bại");
        }
      },
    });
  };

  const showDebtDetail = (record) => {
    setSelectedDebt(record);
    setIsDetailModalOpen(true);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
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
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Số phiếu nhập",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 130,
      ...getColumnSearchProps("invoiceNumber"),
    },
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      ...getColumnSearchProps("dealerName"),
    },
    {
      title: "Người liên hệ",
      dataIndex: "contactPerson",
      key: "contactPerson",
      width: 130,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 110,
    },
    {
      title: "Ngày nhập",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 110,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.orderDate).unix() - dayjs(b.orderDate).unix(),
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (value) => `${value.toLocaleString("vi-VN")} đ`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Đã thanh toán",
      dataIndex: "paidAmount",
      key: "paidAmount",
      width: 140,
      render: (value) => (
        <Text type="success">{value.toLocaleString("vi-VN")} đ</Text>
      ),
      sorter: (a, b) => a.paidAmount - b.paidAmount,
    },
    {
      title: "Còn nợ",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      width: 150,
      render: (value) => (
        <Text type="danger" strong style={{ fontSize: 14 }}>
          {value.toLocaleString("vi-VN")} đ
        </Text>
      ),
      sorter: (a, b) => a.remainingAmount - b.remainingAmount,
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 130,
      render: (date, record) => {
        const isOverdue = dayjs(date).isBefore(dayjs()) && record.remainingAmount > 0;
        return (
          <div>
            <Text type={isOverdue ? "danger" : "default"}>
              {dayjs(date).format("DD/MM/YYYY")}
            </Text>
            {isOverdue && (
              <div>
                <Tag color="error" size="small">
                  Quá hạn {record.daysPastDue} ngày
                </Tag>
              </div>
            )}
          </div>
        );
      },
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const statusConfig = {
          paid: { color: "success", text: "Đã thanh toán đủ", icon: <CheckCircleOutlined /> },
          partial: { color: "processing", text: "Thanh toán 1 phần", icon: <ClockCircleOutlined /> },
          pending: { color: "warning", text: "Chưa thanh toán", icon: <ExclamationCircleOutlined /> },
          overdue: { color: "error", text: "Quá hạn", icon: <WarningOutlined /> },
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
      ],
      onFilter: (value, record) => record.status === value,
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
            onClick={() => showDebtDetail(record)}
          >
            Chi tiết
          </Button>
          {/* {record.status !== "paid" && record.status === "overdue" && (
            <Button
              type="default"
              size="small"
              icon={<WarningOutlined />}
              onClick={() => handleRemindPayment(record)}
              danger
            >
              Nhắc nợ
            </Button>
          )} */}
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    totalDebt: debts.reduce((sum, d) => sum + d.totalAmount, 0),
    totalPaid: debts.reduce((sum, d) => sum + d.paidAmount, 0),
    totalRemaining: debts.reduce((sum, d) => sum + d.remainingAmount, 0),
    overdueCount: debts.filter((d) => d.status === "overdue").length,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <DollarOutlined style={{ marginRight: 8 }} /> Công nợ của đại lý
        </Title>
        <Space>
          <Text type="secondary">
            Theo dõi công nợ đại lý với hãng xe
          </Text>
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
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={debts}
            rowKey="debtId"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            scroll={{ x: 1500 }}
          />
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Chi tiết công nợ - {selectedDebt?.invoiceNumber}
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedDebt(null);
        }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        //   selectedDebt?.status !== "paid" && selectedDebt?.status === "overdue" && (
        //     <Button
        //       key="remind"
        //       danger
        //       icon={<WarningOutlined />}
        //       onClick={() => {
        //         setIsDetailModalOpen(false);
        //         handleRemindPayment(selectedDebt);
        //       }}
        //     >
        //       Gửi nhắc nhở
        //     </Button>
        //   ),
        ]}
        width={900}
      >
        {selectedDebt && (
          <div>
            {/* Thông tin đại lý */}
            <Card title="Thông tin đại lý" size="small" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Tên đại lý">
                  <Text strong>{selectedDebt.dealerName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Người liên hệ">
                  {selectedDebt.contactPerson}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedDebt.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Số phiếu nhập">
                  <Tag color="blue">{selectedDebt.invoiceNumber}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Thông tin công nợ */}
            <Card title="Thông tin thanh toán" size="small" style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Ngày nhập hàng">
                  {dayjs(selectedDebt.orderDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Hạn thanh toán">
                  <Text type={dayjs(selectedDebt.dueDate).isBefore(dayjs()) && selectedDebt.remainingAmount > 0 ? "danger" : "default"}>
                    {dayjs(selectedDebt.dueDate).format("DD/MM/YYYY")}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền hàng">
                  <Text strong style={{ fontSize: 16 }}>
                    {selectedDebt.totalAmount.toLocaleString("vi-VN")} đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Đã thanh toán">
                  <Text type="success" strong style={{ fontSize: 16 }}>
                    {selectedDebt.paidAmount.toLocaleString("vi-VN")} đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Còn nợ" span={2}>
                  <Text type="danger" strong style={{ fontSize: 18 }}>
                    {selectedDebt.remainingAmount.toLocaleString("vi-VN")} đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={2}>
                  {(() => {
                    const statusConfig = {
                      paid: { color: "success", text: "Đã thanh toán đủ" },
                      partial: { color: "processing", text: "Thanh toán 1 phần" },
                      pending: { color: "warning", text: "Chưa thanh toán" },
                      overdue: { color: "error", text: `Quá hạn ${selectedDebt.daysPastDue} ngày` },
                    };
                    const config = statusConfig[selectedDebt.status];
                    return <Tag color={config.color}>{config.text}</Tag>;
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Danh sách xe nhập */}
            <Card title="Danh sách xe đã nhập" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={selectedDebt.items}
                columns={[
                  {
                    title: "Tên xe",
                    dataIndex: "vehicleName",
                    key: "vehicleName",
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    width: 100,
                    align: "center",
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "unitPrice",
                    key: "unitPrice",
                    width: 150,
                    render: (value) => `${value.toLocaleString("vi-VN")} đ`,
                  },
                  {
                    title: "Thành tiền",
                    dataIndex: "total",
                    key: "total",
                    width: 150,
                    render: (value) => (
                      <Text strong>{value.toLocaleString("vi-VN")} đ</Text>
                    ),
                  },
                ]}
                pagination={false}
                size="small"
                summary={(pageData) => {
                  const total = pageData.reduce((sum, item) => sum + item.total, 0);
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <Text strong>Tổng cộng</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                          {total.toLocaleString("vi-VN")} đ
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>

            {/* Lịch sử thanh toán */}
            {selectedDebt.paymentHistory && selectedDebt.paymentHistory.length > 0 && (
              <Card title="Lịch sử thanh toán" size="small">
                <Table
                  dataSource={selectedDebt.paymentHistory}
                  columns={[
                    {
                      title: "Ngày thanh toán",
                      dataIndex: "date",
                      key: "date",
                      width: 150,
                      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
                    },
                    {
                      title: "Số tiền",
                      dataIndex: "amount",
                      key: "amount",
                      width: 180,
                      render: (amount) => (
                        <Text strong type="success">
                          {amount.toLocaleString("vi-VN")} đ
                        </Text>
                      ),
                    },
                    {
                      title: "Ghi chú",
                      dataIndex: "note",
                      key: "note",
                    },
                  ]}
                  pagination={false}
                  size="small"
                />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
