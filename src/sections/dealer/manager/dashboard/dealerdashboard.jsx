import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import { CarOutlined, UserOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export default function DealerDashboard() {
  const statsData = [
    {
      title: 'Total Vehicles',
      value: 1234,
      icon: <CarOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Active Customers',
      value: 567,
      icon: <UserOutlined className="text-green-600" />,
      color: '#52c41a',
    },
    {
      title: 'Monthly Revenue',
      value: 89000,
      prefix: '$',
      icon: <DollarOutlined className="text-yellow-600" />,
      color: '#faad14',
    },
    {
      title: 'Pending Orders',
      value: 23,
      icon: <ShoppingCartOutlined className="text-red-600" />,
      color: '#f5222d',
    },
  ];

  const recentSalesData = [
    {
      key: '1',
      vehicle: 'VinFast VF8',
      customer: 'John Smith',
      price: '$45,000',
      status: 'completed',
      date: '2025-09-20',
    },
    {
      key: '2',
      vehicle: 'VinFast VF9',
      customer: 'Jane Doe',
      price: '$55,000',
      status: 'pending',
      date: '2025-09-21',
    },
    {
      key: '3',
      vehicle: 'VinFast VF6',
      customer: 'Mike Johnson',
      price: '$35,000',
      status: 'completed',
      date: '2025-09-22',
    },
  ];

  const columns = [
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

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your vehicle management dashboard</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Progress and Charts Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="Sales Progress" className="shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Monthly Target</span>
                  <span>75%</span>
                </div>
                <Progress percent={75} strokeColor="#52c41a" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Customer Satisfaction</span>
                  <span>90%</span>
                </div>
                <Progress percent={90} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Inventory Turnover</span>
                  <span>60%</span>
                </div>
                <Progress percent={60} strokeColor="#faad14" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" className="shadow-sm">
            <div className="space-y-3">
              <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <CarOutlined className="mr-2 text-blue-600" />
                Add New Vehicle
              </button>
              <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <UserOutlined className="mr-2 text-green-600" />
                Register Customer
              </button>
              <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <ShoppingCartOutlined className="mr-2 text-orange-600" />
                Process Order
              </button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Sales Table */}
      <Card title="Recent Sales" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={recentSalesData}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}
