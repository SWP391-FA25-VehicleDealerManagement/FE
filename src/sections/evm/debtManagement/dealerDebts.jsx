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
import dayjs from "dayjs";
import useDealerDebt from "../../../hooks/useDealerDebt";
import useDealerStore from "../../../hooks/useDealer";

const { Title, Text } = Typography;
const { Option } = Select;

export default function DealerDebts() {
  const [isDebtLoading, setIsDebtLoading] = useState(false);
  const {
    fetchDealerDebt,
    dealerDebt,
    fetchDebtSchedules,
    debtSchedules,
    isLoadingDebtSchedules,
    clearDebtSchedules,
  } = useDealerDebt();
  const {
    fetchDealers,
    dealers,
    isLoading: isDealerLoading,
  } = useDealerStore();
  const [mergedData, setMergedData] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [form] = Form.useForm();

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

  console.log("check dealer data", dealers);

  console.log("check mergedata", mergedData);

  const showDebtDetail = (record) => {
    setSelectedDebt(record);
    setIsDetailModalOpen(true);
    fetchDebtSchedules(record.debtId);
  };

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
      dataIndex: "dealerName", //
      key: "dealerName",
      ...getColumnSearchProps("dealerName"), //
    },
    {
      title: "SĐT",
      dataIndex: "phone", //
      key: "phone", //
      width: 110,
    },
    {
      title: "Ngày bắt đầu nợ", // Sửa tên cột
      dataIndex: "startDate", // Sửa: Dùng 'startDate' thay vì 'orderDate'
      key: "startDate",
      width: 120,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"), // Thêm kiểm tra
      sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "amountDue", // Sửa: Dùng 'amountDue' thay vì 'totalAmount'
      key: "amountDue",
      width: 150,
      render: (text, record) => {
        // Sửa: Xử lý cả 2 trường hợp
        const value = record.totalAmount || record.amountDue || 0;
        return `${value.toLocaleString("vi-VN")} đ`;
      },
      sorter: (
        a,
        b // Giữ nguyên logic sorter đã đúng
      ) =>
        (a.totalAmount || a.amountDue || 0) -
        (b.totalAmount || b.amountDue || 0),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "amountPaid", // Sửa: Dùng 'amountPaid' thay vì 'paidAmount'
      key: "amountPaid",
      width: 140,
      render: (text, record) => {
        // Sửa: Xử lý cả 2 trường hợp
        const value = record.paidAmount || record.amountPaid || 0;
        return (
          <Text type="success">{`${value.toLocaleString("vi-VN")} đ`}</Text>
        );
      },
      sorter: (
        a,
        b // Sửa: Xử lý cả 2 trường hợp
      ) =>
        (a.paidAmount || a.amountPaid || 0) -
        (b.paidAmount || b.amountPaid || 0),
    },
    {
      title: "Còn nợ",
      dataIndex: "remainingAmount", // (Đã khớp JSON)
      key: "remainingAmount", //
      width: 150,
      render: (remainingAmount) => {
        // Sửa: Xử lý giá trị 0
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
      // THÊM CỘT MỚI
      title: "Tổng lãi",
      dataIndex: "totalInterest", //
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
      dataIndex: "dueDate", // (Đã khớp JSON)
      key: "dueDate", //
      width: 130,
      render: (date, record) => {
        // Sửa: Dùng cờ 'overdue' từ JSON
        const isOverdue =
          record.overdue === true && (record.remainingAmount || 0) > 0;
        return (
          <div>
            <Text type={isOverdue ? "danger" : "default"}>
              {dayjs(date).format("DD/MM/YYYY")}
            </Text>
            {isOverdue && (
              <div>
                <Tag color="error" size="small">
                  Quá hạn
                </Tag>
              </div>
            )}
          </div>
        );
      },
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(), //
    },
    {
      // THÊM CỘT MỚI
      title: "Hình thức trả",
      dataIndex: "paymentType", //
      key: "paymentType",
      width: 120,
      render: (type) => {
        // Render Tag cho dễ nhìn
        if (type === "INSTALLMENT") return <Tag color="blue">Trả góp</Tag>;
        if (type === "FULL") return <Tag color="green">Trả hết</Tag>;
        return <Tag>{type}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status", // (Đã khớp JSON)
      key: "status", //
      width: 140,
      render: (status) => {
        const statusConfig = {
          //
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
          pending: {
            color: "warning",
            text: "Chưa thanh toán",
            icon: <ExclamationCircleOutlined />,
          },
          overdue: {
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
        //
        { text: "Đã thanh toán đủ", value: "paid" },
        { text: "Thanh toán 1 phần", value: "partial" },
        { text: "Chưa thanh toán", value: "pending" },
        { text: "Quá hạn", value: "overdue" },
        { text: "Đang hoạt động", value: "ACTIVE" },
      ],
      onFilter: (value, record) => record.status === value, //
    },
    {
      // THÊM CỘT MỚI
      title: "Ghi chú",
      dataIndex: "notes", //
      key: "notes",
      width: 200,
      ellipsis: true, // Cắt bớt nếu ghi chú quá dài
    },
    {
      title: "Thao tác",
      key: "action", //
      width: 180, //
      fixed: "right", //
      render: (
        _,
        record //
      ) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDebtDetail(record)}
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

      {/* Detail Modal */}
      <Modal
        title={
          <div>
            <FileTextOutlined style={{ marginRight: 8 }} />
            {/* Sửa: Dùng debtId hoặc mã phiếu nếu có */}
            Chi tiết công nợ -{" "}
            {selectedDebt?.invoiceNumber || `Mã #${selectedDebt?.debtId}`}
          </div>
        }
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
          setSelectedDebt(null);
          clearDebtSchedules();
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsDetailModalOpen(false);
              setSelectedDebt(null);
              clearDebtSchedules();
            }}
          >
            Đóng
          </Button>,
        ]}
        width={1200}
      >
        {selectedDebt && (
          <div>
            {/* Thông tin đại lý */}
            <Card
              title="Thông tin đại lý"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Tên đại lý">
                  <Text strong>{selectedDebt.dealerName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {selectedDebt.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Số phiếu nhập">
                  <Tag color="blue">
                    {selectedDebt.invoiceNumber || `#${selectedDebt.debtId}`}
                  </Tag>
                </Descriptions.Item>
                {/* THÊM MỚI: Địa chỉ */}
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedDebt.address}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Thông tin công nợ */}
            <Card
              title="Thông tin thanh toán"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions bordered column={2} size="small">
                {/* SỬA: Dùng 'startDate' thay vì 'orderDate' */}
                <Descriptions.Item label="Ngày bắt đầu nợ">
                  {dayjs(selectedDebt.startDate).format("DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Hạn thanh toán">
                  <Text
                    type={
                      selectedDebt.overdue === true &&
                      selectedDebt.remainingAmount > 0
                        ? "danger"
                        : "default"
                    }
                  >
                    {dayjs(selectedDebt.dueDate).format("DD/MM/YYYY")}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền hàng">
                  <Text strong style={{ fontSize: 16 }}>
                    {(
                      selectedDebt.totalAmount || selectedDebt.amountDue
                    )?.toLocaleString("vi-VN")}{" "}
                    đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Đã thanh toán">
                  <Text type="success" strong style={{ fontSize: 16 }}>
                    {(
                      selectedDebt.paidAmount || selectedDebt.amountPaid
                    )?.toLocaleString("vi-VN")}{" "}
                    đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Còn nợ" span={2}>
                  <Text type="danger" strong style={{ fontSize: 18 }}>
                    {(selectedDebt.remainingAmount || 0)?.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    đ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái" span={2}>
                  {(() => {
                    const statusConfig = {
                      paid: { color: "success", text: "Đã thanh toán đủ" },
                      partial: {
                        color: "processing",
                        text: "Thanh toán 1 phần",
                      },
                      pending: { color: "warning", text: "Chưa thanh toán" },
                      overdue: {
                        color: "error",
                        // Sửa: Dùng cờ 'overdue'
                        text: `Quá hạn`,
                      },
                      ACTIVE: {
                        color: "processing",
                        text: "Đang hoạt động",
                      },
                    };
                    // Sửa: Dùng cờ 'overdue' để xác định
                    const statusKey =
                      selectedDebt.overdue === true
                        ? "overdue"
                        : selectedDebt.status;
                    const config = statusConfig[statusKey];
                    return <Tag color={config?.color}>{config?.text}</Tag>;
                  })()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Danh sách xe nhập (nếu có) */}
            {selectedDebt.items && selectedDebt.items.length > 0 && (
              <Card
                title="Danh sách xe đã nhập"
                size="small"
                style={{ marginBottom: 16 }}
              >
                {/* ... (Phần này giữ nguyên code cũ) ... */}
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
                    const total = pageData.reduce(
                      (sum, item) => sum + item.total,
                      0
                    );
                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={3}>
                          <Text strong>Tổng cộng</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text
                            strong
                            style={{ fontSize: 16, color: "#1890ff" }}
                          >
                            {total.toLocaleString("vi-VN")} đ
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </Card>
            )}

            {/* Lịch trả nợ */}
            <Card title="Lịch trả nợ" size="small">
              {isLoadingDebtSchedules ? (
                // 1. Hiển thị loading khi đang fetch
                <div className="flex justify-center items-center p-10">
                  <Spin />
                </div>
              ) : (
                // 2. Hiển thị bảng với dữ liệu từ store
                <Table
                  dataSource={debtSchedules}
                  rowKey="scheduleId"
                  pagination={false}
                  size="small"
                  scroll={{ x: 1000 }}
                  columns={[
                    // ... (Toàn bộ columns giữ nguyên như cũ)
                    {
                      title: "Kỳ",
                      dataIndex: "periodNo",
                      key: "periodNo",
                      width: 50,
                      align: "center",
                    },
                    {
                      title: "Ngày T.Toán",
                      dataIndex: "dueDate",
                      key: "dueDate",
                      width: 100,
                      render: (date) => dayjs(date).format("DD/MM/YYYY"),
                    },
                    {
                      title: "Gốc",
                      dataIndex: "principal",
                      key: "principal",
                      width: 120,
                      align: "right",
                      render: (val) =>
                        `${(val || 0).toLocaleString("vi-VN")} đ`,
                    },
                    {
                      title: "Lãi",
                      dataIndex: "interest",
                      key: "interest",
                      width: 100,
                      align: "right",
                      render: (val) =>
                        `${(val || 0).toLocaleString("vi-VN")} đ`,
                    },
                    {
                      title: "Tổng kỳ",
                      dataIndex: "installment",
                      key: "installment",
                      width: 130,
                      align: "right",
                      render: (val) => (
                        <Text strong>{`${(val || 0).toLocaleString(
                          "vi-VN"
                        )} đ`}</Text>
                      ),
                    },
                    {
                      title: "Đã trả",
                      dataIndex: "paidAmount",
                      key: "paidAmount",
                      width: 130,
                      align: "right",
                      render: (val) => (
                        <Text type="success">{`${(val || 0).toLocaleString(
                          "vi-VN"
                        )} đ`}</Text>
                      ),
                    },
                    {
                      title: "Còn lại",
                      dataIndex: "remainingAmount",
                      key: "remainingAmount",
                      width: 130,
                      align: "right",
                      render: (val) => (
                        <Text type="danger" strong>{`${(
                          val || 0
                        ).toLocaleString("vi-VN")} đ`}</Text>
                      ),
                    },
                    {
                      title: "Trạng thái",
                      dataIndex: "status",
                      key: "status",
                      width: 110,
                      render: (status, record) => {
                        if (status === "PAID") {
                          return <Tag color="success">Đã thanh toán</Tag>;
                        }
                        if (status === "PENDING" && record.overdue) {
                          return <Tag color="error">Quá hạn</Tag>;
                        }
                        return <Tag color="warning">Chưa tới hạn</Tag>;
                      },
                    },
                  ]}
                  // Thêm: Hiển thị text nếu không có dữ liệu
                  locale={{ emptyText: "Không có lịch trả nợ" }}
                />
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}
