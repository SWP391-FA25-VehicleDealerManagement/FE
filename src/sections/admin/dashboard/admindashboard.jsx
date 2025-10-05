import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Select, Button, Tabs, Tooltip, Spin } from 'antd';
import { UserOutlined, TeamOutlined, ShopOutlined, BarChartOutlined, 
         RiseOutlined, FallOutlined, CarOutlined, DollarOutlined , TrophyOutlined  } from '@ant-design/icons';

export default function AdminDashboard() {
  // State for time period filters and data
  const [timePeriod, setTimePeriod] = useState('month');
  const [regionFilter, setRegionFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  
  // Stats data
  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: '48.5B',
      prefix: '₫',
      icon: <DollarOutlined className="text-blue-600" />,
      color: '#1890ff',
      change: '+12.4%',
      isPositive: true
    },
    {
      title: 'Tổng xe đã bán',
      value: 1280,
      icon: <CarOutlined className="text-green-600" />,
      color: '#52c41a',
      change: '+8.7%',
      isPositive: true
    },
    {
      title: 'Đại lý hiện có',
      value: 15,
      icon: <ShopOutlined className="text-purple-600" />,
      color: '#722ed1',
      change: '+2',
      isPositive: true
    },
    {
      title: 'Kho hàng hiện tại',
      value: 320,
      icon: <BarChartOutlined className="text-orange-600" />,
      color: '#fa8c16',
      change: '-5.3%',
      isPositive: false
    },
  ];

  // Sample sales data by region
  const salesByRegion = [
    { name: 'Miền Bắc', value: 18.7, percentage: 38, color: '#1890ff' },
    { name: 'Miền Trung', value: 12.2, percentage: 25, color: '#52c41a' },
    { name: 'Miền Nam', value: 17.6, percentage: 37, color: '#fa8c16' },
  ];

  // Sample sales data by dealer
  const salesByDealer = [
    { name: 'VinFast Hà Nội', region: 'Miền Bắc', value: 142, amount: 5.3 },
    { name: 'VinFast TP.HCM', region: 'Miền Nam', value: 137, amount: 5.1 },
    { name: 'VinFast Đà Nẵng', region: 'Miền Trung', value: 98, amount: 3.8 },
    { name: 'VinFast Hải Phòng', region: 'Miền Bắc', value: 85, amount: 3.2 },
    { name: 'VinFast Cần Thơ', region: 'Miền Nam', value: 82, amount: 3.1 },
    { name: 'VinFast Nha Trang', region: 'Miền Trung', value: 76, amount: 2.9 },
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
      action: 'Bản ghi bán hàng mới',
      user: 'VinFast Hà Nội',
      time: '2025-10-04 10:30',
      status: 'completed',
    },
    {
      key: '2', 
      action: 'Cập nhật kho hàng',
      user: 'VinFast TP.HCM',
      time: '2025-10-04 09:15',
      status: 'completed',
    },
    {
      key: '3',
      action: 'Báo cáo bán hàng đã tạo',
      user: 'Quản trị hệ thống',
      time: '2025-10-03 16:45',
      status: 'completed',
    },
    {
      key: '4',
      action: 'Cảnh báo hàng tồn kho thấp',
      user: 'VinFast Đà Nẵng',
      time: '2025-10-03 11:20',
      status: 'pending',
    },
  ];

  const activityColumns = [
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Người dùng/Đơn vị',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? 'HOÀN THÀNH' : 'ĐANG CHỜ'}
        </Tag>
      ),
    },
  ];

  const dealerSalesColumns = [
    {
      title: 'Tên đại lý',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Khu vực',
      dataIndex: 'region',
      key: 'region',
      render: (region) => {
        const colorMap = {
          'Miền Bắc': 'blue',
          'Miền Nam': 'green',
          'Miền Trung': 'orange',
        };
        return <Tag color={colorMap[region]}>{region}</Tag>;
      }
    },
    {
      title: 'Xe đã bán',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Doanh thu (₫B)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₫${amount}B`,
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  const inventoryColumns = [
    {
      title: 'Mẫu xe',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kho hàng hiện tại',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Tỷ lệ bán hàng tháng',
      dataIndex: 'consumption',
      key: 'consumption',
      sorter: (a, b) => a.consumption - b.consumption,
    },
    {
      title: 'Luân chuyển (Ngày)',
      dataIndex: 'turnoverDays',
      key: 'turnoverDays',
      render: (days) => {
        let color = 'green';
        if (days > 20) color = 'orange';
        if (days > 30) color = 'red';
        return <Tag color={color}>{days} ngày</Tag>;
      },
      sorter: (a, b) => a.turnoverDays - b.turnoverDays,
    },
  ];
  
  // Sales by region columns for table representation instead of chart
  const regionSalesColumns = [
    {
      title: 'Khu vực',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Doanh thu (₫B)',
      dataIndex: 'value',
      key: 'value',
      render: (value) => `₫${value}B`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Tỷ lệ',
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Bảng điều khiển quản trị</h1>
            <p className="text-gray-600">Báo cáo bán hàng & Phân tích kho hàng</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              defaultValue="month"
              style={{ width: 120 }}
              onChange={value => setTimePeriod(value)}
              options={[
                { value: 'week', label: 'Tuần này' },
                { value: 'month', label: 'Tháng này' },
                { value: 'quarter', label: 'Quý này' },
                { value: 'year', label: 'Năm nay' },
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
                      color={stat.isPositive ? 'success' : 'error'}
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

        {/* Sales Trends */}
        <Card 
          title={
            <div className="flex items-center">
              <CarOutlined className="mr-2 text-blue-600" />
              <span>Xu hướng bán hàng & Kho hàng theo tháng</span>
            </div>
          } 
          className="shadow-sm mb-6"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Mẫu xe</th>
                  <th className="py-3 px-4 text-right">Xe đã bán</th>
                  <th className="py-3 px-4 text-right">Kho hàng</th>
                  <th className="py-3 px-4 text-right">Xu hướng</th>
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
              label: <span className="flex items-center"><ShopOutlined className="mr-1" />Doanh số theo khu vực</span>,
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card className="h-full">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <BarChartOutlined className="mr-2 text-blue-600" />
                        Phân phối doanh số theo khu vực
                      </h3>
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
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <DollarOutlined className="mr-2 text-green-600" />
                        Hiển thị hiệu suất theo khu vực
                      </h3>
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
              label: <span className="flex items-center"><UserOutlined className="mr-1" />Doanh số theo đại lý</span>,
              children: (
                <Card>
                  <div className="mb-4 flex justify-end">
                    <Select
                      defaultValue="all"
                      style={{ width: 150 }}
                      onChange={value => setRegionFilter(value)}
                      options={[
                        { value: 'all', label: 'Tất cả khu vực' },
                        { value: 'Miền Bắc', label: 'Miền Bắc' },
                        { value: 'Miền Trung', label: 'Miền Trung' },
                        { value: 'Miền Nam', label: 'Miền Nam' },
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
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <TrophyOutlined className="mr-2 text-yellow-500" />
                      So sánh hiệu suất đại lý
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left">Đại lý</th>
                            <th className="py-2 px-4 text-right">Hiệu suất</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredDealerSales().map((dealer, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="py-3 px-4">
                                {dealer.name}
                                <Tag className="ml-2" color={
                                  dealer.region === 'Miền Bắc' ? 'blue' :
                                  dealer.region === 'Miền Nam' ? 'green' : 'orange'
                                }>{dealer.region}</Tag>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end items-center">
                                  <span className="text-gray-500 mr-2">{dealer.value} xe đã bán</span>
                                  <div className="w-40 bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className={`h-2.5 rounded-full ${
                                        dealer.region === 'Miền Bắc' ? 'bg-blue-600' :
                                        dealer.region === 'Miền Nam' ? 'bg-green-600' : 'bg-orange-400'
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
            <Card 
              title={
                <div className="flex items-center">
                  <BarChartOutlined className="mr-2 text-orange-600" />
                  <span>Kho hàng & Tỷ lệ tiêu thụ</span>
                </div>
              } 
              className="shadow-sm"
            >
              <Table
                columns={inventoryColumns}
                dataSource={inventoryData}
                pagination={false}
                size="middle"
              />
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CarOutlined className="mr-2 text-blue-600" />
                  Phân tích luân chuyển kho hàng
                </h3>
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
                          <p className="text-gray-500">Luân chuyển: {item.turnoverDays} ngày</p>
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
        <Card 
          title={
            <div className="flex items-center">
              <TeamOutlined className="mr-2 text-cyan-600" />
              <span>Hoạt động gần đây</span>
            </div>
          } 
          className="shadow-sm"
        >
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