import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { InboxOutlined, ShopOutlined, CustomerServiceOutlined, BarChartOutlined } from '@ant-design/icons';

export default function EVMDashboard() {
  const statsData = [
    {
      title: 'Total Inventory',
      value: 2500,
      icon: <InboxOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Active Dealers',
      value: 15,
      icon: <ShopOutlined className="text-green-600" />,
      color: '#52c41a',
    },
    {
      title: 'Support Tickets',
      value: 23,
      icon: <CustomerServiceOutlined className="text-orange-600" />,
      color: '#faad14',
    },
    {
      title: 'Monthly Reports',
      value: 45,
      icon: <BarChartOutlined className="text-red-600" />,
      color: '#f5222d',
    },
  ];

  const inventoryData = [
    {
      key: '1',
      model: 'VinFast VF8',
      quantity: 150,
      allocated: 120,
      available: 30,
      status: 'In Stock',
    },
    {
      key: '2', 
      model: 'VinFast VF9',
      quantity: 100,
      allocated: 95,
      available: 5,
      status: 'Low Stock',
    },
    {
      key: '3',
      model: 'VinFast VF6',
      quantity: 200,
      allocated: 180,
      available: 20,
      status: 'In Stock',
    },
  ];

  const columns = [
    {
      title: 'Vehicle Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Allocated',
      dataIndex: 'allocated',
      key: 'allocated',
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'In Stock' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">EVM Dashboard</h1>
        <p className="text-gray-600">Electric Vehicle Management overview</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Inventory Overview" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={inventoryData}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}