import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Select, Button, Tabs, Tooltip, Spin } from 'antd';
import { UserOutlined, TeamOutlined, ShopOutlined, BarChartOutlined, 
         RiseOutlined, FallOutlined, CarOutlined, DollarOutlined } from '@ant-design/icons';

export default function AdminDashboard() {
  // State for time period filters and data
  const [timePeriod, setTimePeriod] = useState('month');
  const [regionFilter, setRegionFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  
  // Stats data
  const statsData = [
    {
      title: 'Total Revenue',
      value: '48.5B',
      prefix: '₫',
      icon: <DollarOutlined className="text-blue-600" />,
      color: '#1890ff',
      change: '+12.4%',
      isPositive: true
    },
    {
      title: 'Total Vehicles Sold',
      value: 1280,
      icon: <CarOutlined className="text-green-600" />,
      color: '#52c41a',
      change: '+8.7%',
      isPositive: true
    },
    {
      title: 'Active Dealers',
      value: 15,
      icon: <ShopOutlined className="text-purple-600" />,
      color: '#722ed1',
      change: '+2',
      isPositive: true
    },
    {
      title: 'Current Inventory',
      value: 320,
      icon: <BarChartOutlined className="text-orange-600" />,
      color: '#fa8c16',
      change: '-5.3%',
      isPositive: false
    },
  ];

  // Sample sales data by region
  const salesByRegion = [
    { name: 'Northern', value: 18.7, percentage: 38, color: '#1890ff' },
    { name: 'Central', value: 12.2, percentage: 25, color: '#52c41a' },
    { name: 'Southern', value: 17.6, percentage: 37, color: '#fa8c16' },
  ];

  // Sample sales data by dealer
  const salesByDealer = [
    { name: 'VinFast Hanoi', region: 'Northern', value: 142, amount: 5.3 },
    { name: 'VinFast HCMC', region: 'Southern', value: 137, amount: 5.1 },
    { name: 'VinFast Danang', region: 'Central', value: 98, amount: 3.8 },
    { name: 'VinFast Hai Phong', region: 'Northern', value: 85, amount: 3.2 },
    { name: 'VinFast Can Tho', region: 'Southern', value: 82, amount: 3.1 },
    { name: 'VinFast Nha Trang', region: 'Central', value: 76, amount: 2.9 },
  ];

  // Sample inventory data
  const inventoryData = [
    { name: 'VF 5', stock: 85, consumption: 42, turnoverDays: 15 },
    { name: 'VF 6', stock: 120, consumption: 38, turnoverDays: 24 },
    { name: 'VF 7', stock: 65, consumption: 28, turnoverDays: 18 },
    { name: 'VF 8', stock: 50, consumption: 18, turnoverDays: 22 },
  ];
  
  // Simulate data loading when time period changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timePeriod]);

  // Recent activities
  const recentActivities = [
    {
      key: '1',
      action: 'New sales record',
      user: 'VinFast Hanoi',
      time: '2025-10-04 10:30',
      status: 'completed',
    },
    {
      key: '2', 
      action: 'Inventory updated',
      user: 'VinFast HCMC',
      time: '2025-10-04 09:15',
      status: 'completed',
    },
    {
      key: '3',
      action: 'Sales report generated',
      user: 'System Admin',
      time: '2025-10-03 16:45',
      status: 'completed',
    },
    {
      key: '4',
      action: 'Low stock alert',
      user: 'VinFast Danang',
      time: '2025-10-03 11:20',
      status: 'pending',
    },
  ];

  const activityColumns = [
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

  const dealerSalesColumns = [
    {
      title: 'Dealer Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (region) => {
        const colorMap = {
          'Northern': 'blue',
          'Southern': 'green',
          'Central': 'orange',
        };
        return <Tag color={colorMap[region]}>{region}</Tag>;
      }
    },
    {
      title: 'Vehicles Sold',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Revenue (₫B)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₫${amount}B`,
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  const inventoryColumns = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Current Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Monthly Sales Rate',
      dataIndex: 'consumption',
      key: 'consumption',
      sorter: (a, b) => a.consumption - b.consumption,
    },
    {
      title: 'Turnover (Days)',
      dataIndex: 'turnoverDays',
      key: 'turnoverDays',
      render: (days) => {
        let color = 'green';
        if (days > 20) color = 'orange';
        if (days > 30) color = 'red';
        return <Tag color={color}>{days} days</Tag>;
      },
      sorter: (a, b) => a.turnoverDays - b.turnoverDays,
    },
  ];
  
  // Sales by region columns for table representation instead of chart
  const regionSalesColumns = [
    {
      title: 'Region',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Revenue (₫B)',
      dataIndex: 'value',
      key: 'value',
      render: (value) => `₫${value}B`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full" 
              style={{ 
                width: `${percentage}%`, 
                backgroundColor: percentage > 30 ? '#1890ff' : (percentage > 20 ? '#52c41a' : '#fa8c16') 
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
        </div>
      ),
      sorter: (a, b) => a.percentage - b.percentage,
    },
  ];

  // Get filtered dealer sales based on region
  const getFilteredDealerSales = () => {
    return regionFilter === 'all'
      ? salesByDealer
      : salesByDealer.filter(dealer => dealer.region === regionFilter);
  };

  return (
    <div className="fade-in">
      <Spin spinning={isLoading}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Sales Reports & Inventory Analysis</p>
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

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={
                    <div className="flex justify-between">
                      <span>{stat.title}</span>
                      {stat.change && (
                        <Tag color={stat.isPositive ? 'success' : 'error'} className="ml-2">
                          {stat.isPositive ? <RiseOutlined /> : <FallOutlined />} {stat.change}
                        </Tag>
                      )}
                    </div>
                  }
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.icon}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Sales Trends */}
        <Card title="Monthly Sales & Inventory Trend" className="shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Month</th>
                  <th className="py-3 px-4 text-right">Vehicles Sold</th>
                  <th className="py-3 px-4 text-right">Inventory Level</th>
                  <th className="py-3 px-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody>
                {[...inventoryData].sort((a, b) => b.consumption - a.consumption).map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-right">{item.consumption}</td>
                    <td className="py-3 px-4 text-right">{item.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full bg-blue-600" 
                            style={{ width: `${(item.consumption / 50) * 100}%` }}
                          ></div>
                        </div>
                        <span className={item.turnoverDays < 20 ? 'text-green-500' : 'text-orange-500'}>
                          {item.turnoverDays < 20 ? <RiseOutlined /> : <FallOutlined />}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Sales Analytics Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          className="mb-6"
          items={[
            {
              key: '1',
              label: 'Sales by Region',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card className="h-full">
                      <h3 className="text-lg font-semibold mb-4">Regional Sales Distribution</h3>
                      <Table 
                        columns={regionSalesColumns}
                        dataSource={salesByRegion}
                        pagination={false}
                        size="middle"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card className="h-full">
                      <h3 className="text-lg font-semibold mb-4">Regional Performance Visualization</h3>
                      <div className="flex flex-wrap justify-around items-center py-6">
                        {salesByRegion.map((region, index) => (
                          <div key={index} className="text-center mb-4">
                            <div 
                              className="mx-auto rounded-full flex items-center justify-center mb-2"
                              style={{
                                backgroundColor: region.color,
                                width: `${Math.max(region.percentage * 2, 50)}px`,
                                height: `${Math.max(region.percentage * 2, 50)}px`,
                              }}
                            >
                              <span className="text-white font-bold">
                                {region.percentage}%
                              </span>
                            </div>
                            <div className="font-medium">{region.name}</div>
                            <div className="text-gray-500">₫{region.value}B</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: '2',
              label: 'Sales by Dealer',
              children: (
                <Card>
                  <div className="mb-4 flex justify-end">
                    <Select
                      defaultValue="all"
                      style={{ width: 150 }}
                      onChange={value => setRegionFilter(value)}
                      options={[
                        { value: 'all', label: 'All Regions' },
                        { value: 'Northern', label: 'Northern' },
                        { value: 'Central', label: 'Central' },
                        { value: 'Southern', label: 'Southern' },
                      ]}
                    />
                  </div>
                  <Table
                    columns={dealerSalesColumns}
                    dataSource={getFilteredDealerSales()}
                    pagination={{ pageSize: 5 }}
                    size="middle"
                  />
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Dealer Performance Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left">Dealer</th>
                            <th className="py-2 px-4 text-right">Performance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredDealerSales().map((dealer, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="py-3 px-4">
                                {dealer.name}
                                <Tag className="ml-2" color={
                                  dealer.region === 'Northern' ? 'blue' :
                                  dealer.region === 'Southern' ? 'green' : 'orange'
                                }>{dealer.region}</Tag>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end items-center">
                                  <span className="text-gray-500 mr-2">{dealer.value} sold</span>
                                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        dealer.region === 'Northern' ? 'bg-blue-600' :
                                        dealer.region === 'Southern' ? 'bg-green-600' : 'bg-orange-400'
                                      }`}
                                      style={{ width: `${(dealer.value / 150) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              ),
            },
          ]}
        />

        {/* Inventory & Consumption Rate Section */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24}>
            <Card title="Inventory & Consumption Rate" className="shadow-sm">
              <Table
                columns={inventoryColumns}
                dataSource={inventoryData}
                pagination={false}
                size="middle"
              />
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Inventory Turnover Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {inventoryData.map((item, index) => (
                    <Card key={index} size="small" className="shadow-sm">
                      <div className="text-center">
                        <h4 className="font-medium">{item.name}</h4>
                        <div 
                          className="mx-auto my-3 rounded-full flex items-center justify-center" 
                          style={{
                            width: '80px',
                            height: '80px',
                            background: `conic-gradient(
                              ${item.turnoverDays < 18 ? '#52c41a' : 
                                item.turnoverDays < 24 ? '#faad14' : '#f5222d'} 
                              ${item.consumption / (item.stock + item.consumption) * 360}deg, 
                              #f0f0f0 0deg
                            )`
                          }}
                        >
                          <div className="bg-white rounded-full w-[60px] h-[60px] flex items-center justify-center">
                            <span className="font-bold">{Math.round(item.consumption/item.stock * 100)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500">Turnover: {item.turnoverDays} days</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Section */}
        <Card title="Recent Activities" className="shadow-sm">
          <Table
            columns={activityColumns}
            dataSource={recentActivities}
            pagination={false}
            size="middle"
          />
        </Card>
      </Spin>
    </div>
  );
}