import React from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { UserOutlined, TeamOutlined, ShopOutlined, BarChartOutlined } from '@ant-design/icons';

export default function AdminDashboard() {
  const statsData = [
    {
      title: 'Total Dealers',
      value: 15,
      icon: <ShopOutlined className="text-blue-600" />,
      color: '#1890ff',
    },
    {
      title: 'Total Users',
      value: 1250,
      icon: <UserOutlined className="text-green-600" />,
      color: '#52c41a',
    },
    {
      title: 'Active Managers',
      value: 45,
      icon: <TeamOutlined className="text-orange-600" />,
      color: '#faad14',
    },
    {
      title: 'System Reports',
      value: 89,
      icon: <BarChartOutlined className="text-red-600" />,
      color: '#f5222d',
    },
  ];

  const recentActivities = [
    {
      key: '1',
      action: 'New dealer registered',
      user: 'VinFast Hanoi',
      time: '2025-09-24 10:30',
      status: 'completed',
    },
    {
      key: '2', 
      action: 'System settings updated',
      user: 'System Admin',
      time: '2025-09-24 09:15',
      status: 'completed',
    },
    {
      key: '3',
      action: 'User permission modified',
      user: 'John Manager',
      time: '2025-09-24 08:45',
      status: 'pending',
    },
  ];

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'User/Entity',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
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
  ];

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System administration and management overview</p>
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

      <Card title="Recent System Activities" className="shadow-sm">
        <Table
          columns={columns}
          dataSource={recentActivities}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
}