import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Tabs,
  Select,
  Button,
  Spin,
  Avatar,
  Tooltip,
} from "antd";
import {
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  CreditCardOutlined,
  BankOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function DealerDashboard() {
  const [timePeriod, setTimePeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [debtFilter, setDebtFilter] = useState("all");

  // Simulate loading when time period changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timePeriod]);

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "1.85B",
      prefix: "₫",
      icon: <DollarOutlined className="text-blue-600" />,
      color: "#1890ff",
      change: "+12.4%",
      isPositive: true,
    },
    {
      title: "Khách hàng hiện có",
      value: 567,
      icon: <UserOutlined className="text-green-600" />,
      color: "#52c41a",
      change: "+8%",
      isPositive: true,
    },
    {
      title: "Nợ khách hàng",
      value: "320M",
      prefix: "₫",
      icon: <CreditCardOutlined className="text-yellow-600" />,
      color: "#faad14",
      change: "+5.7%",
      isPositive: false,
    },
    {
      title: "Khoản phải trả VinFast",
      value: "750M",
      prefix: "₫",
      icon: <BankOutlined className="text-purple-600" />,
      color: "#722ed1",
      change: "-12.3%",
      isPositive: true,
    },
  ];

  // Sales staff data
  const salesStaffData = [
    {
      id: 1,
      name: "Nguyen Van A",
      avatar: "https://i.pravatar.cc/150?img=11",
      sales: 12,
      revenue: 480,
      commissions: 24,
      target: 85,
      performance: "excellent",
    },
    {
      id: 2,
      name: "Tran Thi B",
      avatar: "https://i.pravatar.cc/150?img=5",
      sales: 9,
      revenue: 360,
      commissions: 18,
      target: 65,
      performance: "good",
    },
    {
      id: 3,
      name: "Le Van C",
      avatar: "https://i.pravatar.cc/150?img=8",
      sales: 7,
      revenue: 280,
      commissions: 14,
      target: 55,
      performance: "good",
    },
    {
      id: 4,
      name: "Pham Thi D",
      avatar: "https://i.pravatar.cc/150?img=9",
      sales: 5,
      revenue: 200,
      commissions: 10,
      target: 40,
      performance: "average",
    },
    {
      id: 5,
      name: "Hoang Van E",
      avatar: "https://i.pravatar.cc/150?img=3",
      sales: 3,
      revenue: 120,
      commissions: 6,
      target: 20,
      performance: "below",
    },
  ];

  // Customer debt data
  const customerDebtData = [
    {
      id: 1,
      name: "Cong Ty TNHH ABC",
      contact: "Nguyen Van X",
      phone: "0987654321",
      totalPurchased: 580,
      debtAmount: 120,
      dueDate: "2025-10-30",
      status: "normal",
    },
    {
      id: 2,
      name: "Tap Doan XYZ",
      contact: "Tran Van Y",
      phone: "0912345678",
      totalPurchased: 780,
      debtAmount: 90,
      dueDate: "2025-10-15",
      status: "warning",
    },
    {
      id: 3,
      name: "Cong Ty Co Phan LMN",
      contact: "Le Thi Z",
      phone: "0909090909",
      totalPurchased: 350,
      debtAmount: 65,
      dueDate: "2025-11-05",
      status: "normal",
    },
    {
      id: 4,
      name: "Doanh Nghiep EFG",
      contact: "Pham Van W",
      phone: "0977777777",
      totalPurchased: 420,
      debtAmount: 45,
      dueDate: "2025-09-30",
      status: "overdue",
    },
  ];

  // Manufacturer payment data - Only tracking debts to VinFast
  const manufacturerPaymentData = [
    {
      id: 1,
      orderNumber: "ORD-2025-10-001",
      orderDate: "2025-09-15",
      vehicleModel: "VinFast VF8",
      quantity: 5,
      totalAmount: 750,
      paidAmount: 450,
      remainingAmount: 300,
      dueDate: "2025-10-15",
      status: "pending",
    },
    {
      id: 2,
      orderNumber: "ORD-2025-09-015",
      orderDate: "2025-08-22",
      vehicleModel: "VinFast VF9",
      quantity: 3,
      totalAmount: 690,
      paidAmount: 400,
      remainingAmount: 290,
      dueDate: "2025-10-22",
      status: "warning",
    },
    {
      id: 3,
      orderNumber: "ORD-2025-09-008",
      orderDate: "2025-08-10",
      vehicleModel: "VinFast VF6",
      quantity: 8,
      totalAmount: 720,
      paidAmount: 720,
      remainingAmount: 0,
      dueDate: "2025-09-10",
      status: "completed",
    },
    {
      id: 4,
      orderNumber: "ORD-2025-08-025",
      orderDate: "2025-07-30",
      vehicleModel: "VinFast VF7",
      quantity: 4,
      totalAmount: 480,
      paidAmount: 320,
      remainingAmount: 160,
      dueDate: "2025-10-30",
      status: "pending",
    },
  ];

  const recentSalesData = [
    {
      key: "1",
      vehicle: "VinFast VF8",
      customer: "Cong Ty TNHH ABC",
      salesperson: "Nguyen Van A",
      price: "₫950M",
      status: "completed",
      date: "2025-10-02",
    },
    {
      key: "2",
      vehicle: "VinFast VF9",
      customer: "Tap Doan XYZ",
      salesperson: "Tran Thi B",
      price: "₫1.2B",
      status: "pending",
      date: "2025-10-03",
    },
    {
      key: "3",
      vehicle: "VinFast VF6",
      customer: "Doanh Nghiep EFG",
      salesperson: "Nguyen Van A",
      price: "₫675M",
      status: "completed",
      date: "2025-10-04",
    },
  ];

  // Recent sales columns
  const salesColumns = [
    {
      title: "Xe",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Nhân viên bán hàng",
      dataIndex: "salesperson",
      key: "salesperson",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "orange"}>
          {status === "completed" ? "HOÀN THÀNH" : "ĐANG CHỜ"}
        </Tag>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
  ];

  // Staff sales performance columns
  const staffColumns = [
    {
      title: "Nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} size="small" className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: "Xe đã bán",
      dataIndex: "sales",
      key: "sales",
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: "Doanh thu (₫M)",
      dataIndex: "revenue",
      key: "revenue",
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: "Hoa hồng (₫M)",
      dataIndex: "commissions",
      key: "commissions",
      render: (val) => `₫${val}M`,
    },
    {
      title: "Đạt mục tiêu",
      dataIndex: "target",
      key: "target",
      render: (target) => (
        <div>
          <Progress
            percent={target}
            size="small"
            strokeColor={
              target >= 80
                ? "#52c41a"
                : target >= 60
                ? "#1890ff"
                : target >= 40
                ? "#faad14"
                : "#f5222d"
            }
          />
        </div>
      ),
      sorter: (a, b) => a.target - b.target,
    },
    {
      title: "Hiệu suất",
      dataIndex: "performance",
      key: "performance",
      render: (performance) => {
        const colorMap = {
          excellent: "green",
          good: "blue",
          average: "orange",
          below: "red",
        };
        const performanceText = {
          excellent: "XUẤT SẮC",
          good: "TỐT",
          average: "TRUNG BÌNH",
          below: "KÉM",
        };
        return (
          <Tag color={colorMap[performance]}>{performanceText[performance]}</Tag>
        );
      },
    },
  ];

  // Customer debt columns
  const customerDebtColumns = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Người liên hệ",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tổng mua (₫M)",
      dataIndex: "totalPurchased",
      key: "totalPurchased",
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.totalPurchased - b.totalPurchased,
    },
    {
      title: "Số nợ (₫M)",
      dataIndex: "debtAmount",
      key: "debtAmount",
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.debtAmount - b.debtAmount,
    },
    {
      title: "Ngày đáo hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          normal: "green",
          warning: "orange",
          overdue: "red",
        };
        const statusText = {
          normal: "BÌNH THƯỜNG",
          warning: "CẢNH BÁO",
          overdue: "QUÁ HẠN"
        };
        return (
          <Tag color={colorMap[status]}>
            {status === "overdue" ? (
              <span>
                <ExclamationCircleOutlined /> {statusText[status]}
              </span>
            ) : (
              statusText[status]
            )}
          </Tag>
        );
      },
    },
  ];

  // Manufacturer payment columns
  const manufacturerPaymentColumns = [
    {
      title: "Số đơn hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Mẫu xe",
      dataIndex: "vehicleModel",
      key: "vehicleModel",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Tổng tiền (₫M)",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Đã trả (₫M)",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (val) => `₫${val}M`,
    },
    {
      title: "Còn lại (₫M)",
      dataIndex: "remainingAmount",
      key: "remainingAmount",
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.remainingAmount - b.remainingAmount,
    },
    {
      title: "Ngày đáo hạn",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          completed: "green",
          pending: "blue",
          warning: "orange",
          overdue: "red",
        };
        const statusText = {
          completed: "HOÀN THÀNH",
          pending: "ĐANG CHỜ",
          warning: "CẢNH BÁO",
          overdue: "QUÁ HẠN"
        };
        return (
          <Tag color={colorMap[status]}>
            {status === "overdue" ? (
              <span>
                <ExclamationCircleOutlined /> {statusText[status]}
              </span>
            ) : (
              statusText[status]
            )}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="fade-in">
      <Spin spinning={isLoading}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bảng điều khiển Quản lý Đại lý
            </h1>
            <p className="text-gray-600">
              Hiệu suất bán hàng và báo cáo tài chính
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={(value) => setTimePeriod(value)}
              options={[
                { value: "week", label: "Tuần này" },
                { value: "month", label: "Tháng này" },
                { value: "quarter", label: "Quý này" },
                { value: "year", label: "Năm nay" },
              ]}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[20, 20]} className="mb-8">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className="h-full shadow-sm hover:shadow-md transition-shadow border-t-4"
                style={{ borderTopColor: stat.color }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div
                      className="p-2 mr-3 rounded-lg"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      {React.cloneElement(stat.icon, {
                        style: { fontSize: "22px", color: stat.color },
                      })}
                    </div>
                    <span className="font-medium text-gray-700">
                      {stat.title}
                    </span>
                  </div>
                  {stat.change && (
                    <Tag
                      color={
                        (stat.isPositive && stat.title !== "Customer Debt") ||
                        (!stat.isPositive && stat.title === "Customer Debt")
                          ? "success"
                          : "error"
                      }
                    >
                      {stat.isPositive ? <RiseOutlined /> : <FallOutlined />}{" "}
                      {stat.change}
                    </Tag>
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className="text-2xl font-semibold"
                    style={{ color: stat.color }}
                  >
                    {stat.prefix}
                    {stat.value}
                  </span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Staff Sales Performance */}
        <Card
          title={
            <div className="flex items-center">
              <TeamOutlined className="mr-2 text-blue-600" />
              <span>Hiệu suất bán hàng theo nhân viên</span>
            </div>
          }
          className="shadow-sm mb-6"
        >
          <Table
            columns={staffColumns}
            dataSource={salesStaffData}
            pagination={false}
            size="middle"
          />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {salesStaffData.slice(0, 4).map((staff, index) => (
              <Card key={index} size="small" className="bg-gray-50">
                <div className="flex items-center space-x-3">
                  <Avatar src={staff.avatar} size={48} />
                  <div>
                    <div className="font-medium">{staff.name}</div>
                    <div className="text-sm text-gray-500">
                      {staff.sales} vehicles | ₫{staff.revenue}M
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tiến độ mục tiêu</span>
                    <span>{staff.target}%</span>
                  </div>
                  <Progress
                    percent={staff.target}
                    size="small"
                    showInfo={false}
                    strokeColor={
                      staff.target >= 80
                        ? "#52c41a"
                        : staff.target >= 60
                        ? "#1890ff"
                        : staff.target >= 40
                        ? "#faad14"
                        : "#f5222d"
                    }
                  />
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Debt Reports */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          className="mb-6"
          type="card"
          items={[
            {
              key: "1",
              label: (
                <span className="flex items-center px-1">
                  <CreditCardOutlined className="mr-2" /> Báo cáo nợ khách hàng
                </span>
              ),
              children: (
                <div className="bg-white p-5 border border-gray-200 border-t-0 rounded-b-lg">
                  <div className="mb-5 flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Thanh toán chưa hoàn tất của khách hàng
                        </h3>
                      </div>
                      <p className="text-gray-500">
                        Theo dõi và quản lý nợ và lịch thanh toán của khách hàng
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Select
                        defaultValue="all"
                        style={{ width: 160 }}
                        className="mr-3"
                        onChange={(value) => setDebtFilter(value)}
                        options={[
                          { value: "all", label: "Tất cả trạng thái" },
                          { value: "normal", label: "Bình thường" },
                          { value: "warning", label: "Cảnh báo" },
                          { value: "overdue", label: "Quá hạn" },
                        ]}
                      />
                      <Button type="primary" icon={<CreditCardOutlined />}>
                        Thu nợ
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden mb-5">
                    <Table
                      columns={customerDebtColumns}
                      dataSource={customerDebtData}
                      pagination={{ pageSize: 10 }}
                      size="middle"
                    />
                  </div>
                  <div className="mt-5 p-5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-semibold text-gray-800 mb-1">Tổng hợp nợ khách hàng</h4>
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium mr-2">Tổng nợ chưa thanh toán:</span>
                          <span className="text-xl font-bold text-blue-700">₫320M</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="text-center px-4 py-3 rounded-lg bg-green-50 border border-green-100">
                          <div className="text-xs uppercase font-medium text-green-700">Bình thường</div>
                          <div className="text-lg font-bold text-green-600 mt-1">₫150M</div>
                        </div>
                        <div className="text-center px-4 py-3 rounded-lg bg-orange-50 border border-orange-100">
                          <div className="text-xs uppercase font-medium text-orange-700">Cảnh báo</div>
                          <div className="text-lg font-bold text-orange-600 mt-1">₫90M</div>
                        </div>
                        <div className="text-center px-4 py-3 rounded-lg bg-red-50 border border-red-100">
                          <div className="text-xs uppercase font-medium text-red-700">Quá hạn</div>
                          <div className="text-lg font-bold text-red-600 mt-1">₫80M</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Payment History */}
                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <FileDoneOutlined className="text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">
                        Thanh toán khách hàng gần đây
                      </h4>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table
                        columns={[
                          {
                            title: "Mã thanh toán",
                            dataIndex: "paymentId",
                            key: "paymentId",
                          },
                          {
                            title: "Khách hàng",
                            dataIndex: "customer",
                            key: "customer",
                          },
                          {
                            title: "Ngày",
                            dataIndex: "date",
                            key: "date",
                          },
                          {
                            title: "Số hoá đơn",
                            dataIndex: "invoiceRef",
                            key: "invoiceRef",
                          },
                          {
                            title: "Số tiền (₫M)",
                            dataIndex: "amount",
                            key: "amount",
                            render: (val) => `₫${val}M`,
                          },
                          {
                            title: "Phương thức",
                            dataIndex: "method",
                            key: "method",
                          },
                        ]}
                        dataSource={[
                          {
                            key: "1",
                            paymentId: "CUST-PAY-2025-10-01",
                            customer: "Tap Doan XYZ",
                            date: "2025-10-01",
                            invoiceRef: "INV-2025-09-15",
                            amount: 120,
                            method: "Bank Transfer",
                          },
                          {
                            key: "2",
                            paymentId: "CUST-PAY-2025-09-28",
                            customer: "Cong Ty TNHH ABC",
                            date: "2025-09-28",
                            invoiceRef: "INV-2025-09-10",
                            amount: 85,
                            method: "Credit Card",
                          },
                          {
                            key: "3",
                            paymentId: "CUST-PAY-2025-09-22",
                            customer: "Cong Ty Co Phan LMN",
                            date: "2025-09-22",
                            invoiceRef: "INV-2025-08-30",
                            amount: 150,
                            method: "Bank Transfer",
                          },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "2",
              label: (
                <span>
                  <BankOutlined /> Nghĩa vụ thanh toán VinFast
                </span>
              ),
              children: (
                <div>
                  <div className="mb-5 flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Nghĩa vụ thanh toán VinFast
                        </h3>
                      </div>
                      <p className="text-gray-500">
                        Theo dõi nghĩa vụ thanh toán của đại lý với VinFast
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button type="primary" icon={<FileDoneOutlined />}>
                        Xử lý thanh toán
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden mb-5">
                    <Table
                      columns={manufacturerPaymentColumns}
                      dataSource={manufacturerPaymentData}
                      pagination={{ pageSize: 10 }}
                      size="middle"
                    />
                  </div>
                  <div className="mt-5 p-5 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="mb-4 md:mb-0">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          Tổng hợp thanh toán cho VinFast
                        </h4>
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium mr-2">
                            Tổng cần trả:
                          </span>
                          <span className="text-xl font-bold text-blue-700">
                            ₫750M
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center px-4 py-3 rounded-lg bg-green-50 border border-green-100">
                          <div className="text-xs uppercase font-medium text-green-700">
                            Đã thanh toán
                          </div>
                          <div className="text-lg font-bold text-green-600 mt-1">
                            ₫1,890M
                          </div>
                        </div>
                        <div className="text-center px-4 py-3 rounded-lg bg-blue-50 border border-blue-100">
                          <div className="text-xs uppercase font-medium text-blue-700">
                            Đang chờ
                          </div>
                          <div className="text-lg font-bold text-blue-600 mt-1">
                            ₫460M
                          </div>
                        </div>
                        <div className="text-center px-4 py-3 rounded-lg bg-orange-50 border border-orange-100">
                          <div className="text-xs uppercase font-medium text-orange-700">
                            Đến hạn tuần này
                          </div>
                          <div className="text-lg font-bold text-orange-600 mt-1">
                            ₫300M
                          </div>
                        </div>
                        <div className="text-center px-4 py-3 rounded-lg bg-red-50 border border-red-100">
                          <div className="text-xs uppercase font-medium text-red-700">
                            Đến hạn tháng này
                          </div>
                          <div className="text-lg font-bold text-red-600 mt-1">
                            ₫450M
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <FileDoneOutlined className="text-blue-600 mr-2" />
                      <h4 className="font-semibold text-gray-800">
                        Lịch sử thanh toán gần đây
                      </h4>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table
                        columns={[
                          {
                            title: "Mã thanh toán",
                            dataIndex: "paymentId",
                            key: "paymentId",
                          },
                          {
                            title: "Ngày",
                            dataIndex: "date",
                            key: "date",
                          },
                          {
                            title: "Số đơn hàng",
                            dataIndex: "orderRef",
                            key: "orderRef",
                          },
                          {
                            title: "Số tiền (₫M)",
                            dataIndex: "amount",
                            key: "amount",
                            render: (val) => `₫${val}M`,
                          },
                          {
                            title: "Phương thức",
                            dataIndex: "method",
                            key: "method",
                          },
                        ]}
                        dataSource={[
                          {
                            key: "1",
                            paymentId: "PAY-2025-09-30-001",
                            date: "2025-09-30",
                            orderRef: "ORD-2025-09-008",
                            amount: 200,
                            method: "Bank Transfer",
                          },
                          {
                            key: "2",
                            paymentId: "PAY-2025-09-20-002",
                            date: "2025-09-20",
                            orderRef: "ORD-2025-08-025",
                            amount: 320,
                            method: "Bank Transfer",
                          },
                          {
                            key: "3",
                            paymentId: "PAY-2025-09-15-003",
                            date: "2025-09-15",
                            orderRef: "ORD-2025-09-015",
                            amount: 400,
                            method: "Corporate Credit",
                          },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
        />

        {/* Recent Sales Table */}
        <Card
          title={
            <div className="flex items-center">
              <FileDoneOutlined className="mr-2 text-green-600" />
              <span>Giao dịch bán hàng gần đây</span>
            </div>
          }
          className="shadow-sm"
        >
          <Table
            columns={salesColumns}
            dataSource={recentSalesData}
            pagination={false}
            size="middle"
          />
        </Card>
      </Spin>
    </div>
  );
}
