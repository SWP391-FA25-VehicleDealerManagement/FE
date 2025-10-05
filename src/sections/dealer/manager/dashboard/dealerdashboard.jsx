import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Tabs, Select, Button, Spin, Avatar, Tooltip } from 'antd';
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
  ExclamationCircleOutlined
} from '@ant-design/icons';

export default function DealerDashboard() {
  const [timePeriod, setTimePeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [debtFilter, setDebtFilter] = useState('all');
  
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
      title: 'Total Revenue',
      value: '1.85B',
      prefix: '₫',
      icon: <DollarOutlined className="text-blue-600" />,
      color: '#1890ff',
      change: '+12.4%',
      isPositive: true
    },
    {
      title: 'Active Customers',
      value: 567,
      icon: <UserOutlined className="text-green-600" />,
      color: '#52c41a',
      change: '+8%',
      isPositive: true
    },
    {
      title: 'Customer Debt',
      value: '320M',
      prefix: '₫',
      icon: <CreditCardOutlined className="text-yellow-600" />,
      color: '#faad14',
      change: '+5.7%',
      isPositive: false
    },
    {
      title: 'Pending Orders',
      value: 23,
      icon: <ShoppingCartOutlined className="text-red-600" />,
      color: '#f5222d',
      change: '-8.3%',
      isPositive: true
    },
  ];

  // Sales staff data
  const salesStaffData = [
    {
      id: 1,
      name: 'Nguyen Van A',
      avatar: 'https://i.pravatar.cc/150?img=11',
      sales: 12,
      revenue: 480,
      commissions: 24,
      target: 85,
      performance: 'excellent',
    },
    {
      id: 2,
      name: 'Tran Thi B',
      avatar: 'https://i.pravatar.cc/150?img=5',
      sales: 9,
      revenue: 360,
      commissions: 18,
      target: 65,
      performance: 'good',
    },
    {
      id: 3,
      name: 'Le Van C',
      avatar: 'https://i.pravatar.cc/150?img=8',
      sales: 7,
      revenue: 280,
      commissions: 14,
      target: 55,
      performance: 'good',
    },
    {
      id: 4,
      name: 'Pham Thi D',
      avatar: 'https://i.pravatar.cc/150?img=9',
      sales: 5,
      revenue: 200,
      commissions: 10,
      target: 40,
      performance: 'average',
    },
    {
      id: 5,
      name: 'Hoang Van E',
      avatar: 'https://i.pravatar.cc/150?img=3',
      sales: 3,
      revenue: 120,
      commissions: 6,
      target: 20,
      performance: 'below',
    },
  ];

  // Customer debt data
  const customerDebtData = [
    {
      id: 1,
      name: 'Cong Ty TNHH ABC',
      contact: 'Nguyen Van X',
      phone: '0987654321',
      totalPurchased: 580,
      debtAmount: 120,
      dueDate: '2025-10-30',
      status: 'normal',
    },
    {
      id: 2,
      name: 'Tap Doan XYZ',
      contact: 'Tran Van Y',
      phone: '0912345678',
      totalPurchased: 780,
      debtAmount: 90,
      dueDate: '2025-10-15',
      status: 'warning',
    },
    {
      id: 3,
      name: 'Cong Ty Co Phan LMN',
      contact: 'Le Thi Z',
      phone: '0909090909',
      totalPurchased: 350,
      debtAmount: 65,
      dueDate: '2025-11-05',
      status: 'normal',
    },
    {
      id: 4,
      name: 'Doanh Nghiep EFG',
      contact: 'Pham Van W',
      phone: '0977777777',
      totalPurchased: 420,
      debtAmount: 45,
      dueDate: '2025-09-30',
      status: 'overdue',
    },
  ];

  // Manufacturer debt data
  const manufacturerDebtData = [
    {
      id: 1,
      name: 'VinFast Motors',
      contact: 'Dinh Thi M',
      totalOrders: 1250,
      debtAmount: 180,
      dueDate: '2025-11-15',
      status: 'normal',
    },
    {
      id: 2,
      name: 'VinFast Parts Ltd',
      contact: 'Hoang Van N',
      totalOrders: 850,
      debtAmount: 75,
      dueDate: '2025-10-20',
      status: 'warning',
    },
    {
      id: 3,
      name: 'VinFast Services',
      contact: 'Bui Thi P',
      totalOrders: 520,
      debtAmount: 30,
      dueDate: '2025-10-10',
      status: 'normal',
    },
  ];

  const recentSalesData = [
    {
      key: '1',
      vehicle: 'VinFast VF8',
      customer: 'Cong Ty TNHH ABC',
      salesperson: 'Nguyen Van A',
      price: '₫950M',
      status: 'completed',
      date: '2025-10-02',
    },
    {
      key: '2',
      vehicle: 'VinFast VF9',
      customer: 'Tap Doan XYZ',
      salesperson: 'Tran Thi B',
      price: '₫1.2B',
      status: 'pending',
      date: '2025-10-03',
    },
    {
      key: '3',
      vehicle: 'VinFast VF6',
      customer: 'Doanh Nghiep EFG',
      salesperson: 'Nguyen Van A',
      price: '₫675M',
      status: 'completed',
      date: '2025-10-04',
    },
  ];

  // Recent sales columns
  const salesColumns = [
    {
      title: 'Vehicle',
      dataIndex: 'vehicle',
      key: 'vehicle',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Sales Person',
      dataIndex: 'salesperson',
      key: 'salesperson',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // Staff sales performance columns
  const staffColumns = [
    {
      title: 'Staff',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} size="small" className="mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: 'Vehicles Sold',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: 'Revenue (₫M)',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Commission (₫M)',
      dataIndex: 'commissions',
      key: 'commissions',
      render: (val) => `₫${val}M`,
    },
    {
      title: 'Target Achievement',
      dataIndex: 'target',
      key: 'target',
      render: (target) => (
        <div>
          <Progress 
            percent={target} 
            size="small"
            strokeColor={
              target >= 80 ? '#52c41a' :
              target >= 60 ? '#1890ff' :
              target >= 40 ? '#faad14' : '#f5222d'
            }
          />
        </div>
      ),
      sorter: (a, b) => a.target - b.target,
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      render: (performance) => {
        const colorMap = {
          'excellent': 'green',
          'good': 'blue',
          'average': 'orange',
          'below': 'red',
        };
        return (
          <Tag color={colorMap[performance]}>
            {performance.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  // Customer debt columns
  const customerDebtColumns = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Total Purchased (₫M)',
      dataIndex: 'totalPurchased',
      key: 'totalPurchased',
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.totalPurchased - b.totalPurchased,
    },
    {
      title: 'Debt Amount (₫M)',
      dataIndex: 'debtAmount',
      key: 'debtAmount',
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.debtAmount - b.debtAmount,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          'normal': 'green',
          'warning': 'orange',
          'overdue': 'red',
        };
        return (
          <Tag color={colorMap[status]}>
            {status === 'overdue' ? 
              <span><ExclamationCircleOutlined /> OVERDUE</span> : 
              status.toUpperCase()
            }
          </Tag>
        );
      },
    },
  ];

  // Manufacturer debt columns
  const manufacturerDebtColumns = [
    {
      title: 'Manufacturer',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Total Orders (₫M)',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Debt Amount (₫M)',
      dataIndex: 'debtAmount',
      key: 'debtAmount',
      render: (val) => `₫${val}M`,
      sorter: (a, b) => a.debtAmount - b.debtAmount,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          'normal': 'green',
          'warning': 'orange',
          'overdue': 'red',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.toUpperCase()}
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Dealer Manager Dashboard</h1>
            <p className="text-gray-600">Sales performance and financial reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={value => setTimePeriod(value)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' },
              ]}
            />
            <Button type="primary">Export Report</Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[20, 20]} className="mb-8">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-t-4" style={{ borderTopColor: stat.color }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="p-2 mr-3 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                      {React.cloneElement(stat.icon, { style: { fontSize: '22px', color: stat.color } })}
                    </div>
                    <span className="font-medium text-gray-700">{stat.title}</span>
                  </div>
                  {stat.change && (
                    <Tag color={
                      (stat.isPositive && stat.title !== 'Customer Debt') || 
                      (!stat.isPositive && stat.title === 'Customer Debt') ? 'success' : 'error'
                    }>
                      {stat.isPositive ? <RiseOutlined /> : <FallOutlined />} {stat.change}
                    </Tag>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-semibold" style={{ color: stat.color }}>
                    {stat.prefix}{stat.value}
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
              <span>Sales Performance by Staff</span>
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
                    <span>Target Progress</span>
                    <span>{staff.target}%</span>
                  </div>
                  <Progress 
                    percent={staff.target} 
                    size="small" 
                    showInfo={false}
                    strokeColor={
                      staff.target >= 80 ? '#52c41a' :
                      staff.target >= 60 ? '#1890ff' :
                      staff.target >= 40 ? '#faad14' : '#f5222d'
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
          onChange={key => setActiveTab(key)}
          className="mb-6"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <CreditCardOutlined /> Customer Debt Reports
                </span>
              ),
              children: (
                <div>
                  <div className="mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Customer Outstanding Payments</h3>
                      <p className="text-gray-500">Track and manage customer debts and payment schedules</p>
                    </div>
                    <Select
                      defaultValue="all"
                      style={{ width: 150 }}
                      onChange={value => setDebtFilter(value)}
                      options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'overdue', label: 'Overdue' },
                      ]}
                    />
                  </div>
                  <Table
                    columns={customerDebtColumns}
                    dataSource={customerDebtData}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                  />
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Customer Debt Summary</h4>
                        <p className="text-gray-500">Total outstanding: ₫320M</p>
                      </div>
                      <div className="flex space-x-4">
                        <Statistic 
                          title="Normal" 
                          value="₫150M" 
                          valueStyle={{ color: 'green', fontSize: '16px' }} 
                        />
                        <Statistic 
                          title="Warning" 
                          value="₫90M" 
                          valueStyle={{ color: 'orange', fontSize: '16px' }} 
                        />
                        <Statistic 
                          title="Overdue" 
                          value="₫80M" 
                          valueStyle={{ color: 'red', fontSize: '16px' }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <BankOutlined /> Manufacturer Debt Reports
                </span>
              ),
              children: (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Manufacturer Accounts Payable</h3>
                    <p className="text-gray-500">Monitor debts owed to manufacturers and suppliers</p>
                  </div>
                  <Table
                    columns={manufacturerDebtColumns}
                    dataSource={manufacturerDebtData}
                    pagination={{ pageSize: 10 }}
                    size="middle"
                  />
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">Manufacturer Debt Summary</h4>
                        <p className="text-gray-500">Total payable: ₫285M</p>
                      </div>
                      <div className="flex space-x-4">
                        <Statistic 
                          title="Due this week" 
                          value="₫30M" 
                          valueStyle={{ color: 'orange', fontSize: '16px' }} 
                        />
                        <Statistic 
                          title="Due this month" 
                          value="₫255M" 
                          valueStyle={{ color: 'blue', fontSize: '16px' }} 
                        />
                      </div>
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
              <span>Recent Sales Transactions</span>
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
