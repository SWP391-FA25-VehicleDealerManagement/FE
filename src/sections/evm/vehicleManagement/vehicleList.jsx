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
  Select
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CarOutlined,
  FilterOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  // Mock data for vehicles
  const mockVehicles = [
    {
      id: "VF1001",
      model: "VF8",
      color: "Đen",
      price: 1200000000,
      year: 2023,
      status: "available",
      dealerId: "DL001",
      dealerName: "Đại lý VinFast Hà Nội",
      manufactureDate: "2023-05-12",
    },
    {
      id: "VF1002",
      model: "VF9",
      color: "Trắng",
      price: 1500000000,
      year: 2023,
      status: "sold",
      dealerId: "DL002",
      dealerName: "Đại lý VinFast Hồ Chí Minh",
      manufactureDate: "2023-04-15",
    },
    {
      id: "VF1003",
      model: "VF5",
      color: "Xanh",
      price: 800000000,
      year: 2023,
      status: "available",
      dealerId: "DL001",
      dealerName: "Đại lý VinFast Hà Nội",
      manufactureDate: "2023-06-20",
    },
    {
      id: "VF1004",
      model: "VF6",
      color: "Đỏ",
      price: 950000000,
      year: 2023,
      status: "available",
      dealerId: "DL003",
      dealerName: "Đại lý VinFast Đà Nẵng",
      manufactureDate: "2023-07-05",
    },
  ];

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
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
      title: "Mã phương tiện",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      ...getColumnSearchProps("model"),
      sorter: (a, b) => a.model.localeCompare(b.model),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      filters: [
        { text: "Đen", value: "Đen" },
        { text: "Trắng", value: "Trắng" },
        { text: "Đỏ", value: "Đỏ" },
        { text: "Xanh", value: "Xanh" },
      ],
      onFilter: (value, record) => record.color === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: "Đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      ...getColumnSearchProps("dealerName"),
      sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Còn hàng", value: "available" },
        { text: "Đã bán", value: "sold" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "available" ? "green" : "blue"}>
          {status === "available" ? "Còn hàng" : "Đã bán"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Link to={`/evm-staff/vehicles/${record.id}`}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
          >
            Xem chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <CarOutlined style={{ marginRight: 8 }} /> Danh sách phương tiện
        </Title>
        <Space>
          <Select 
            placeholder="Lọc theo model"
            style={{ width: 150 }}
            allowClear
          >
            <Option value="VF5">VF5</Option>
            <Option value="VF6">VF6</Option>
            <Option value="VF7">VF7</Option>
            <Option value="VF8">VF8</Option>
            <Option value="VF9">VF9</Option>
          </Select>
          <Select 
            placeholder="Lọc theo đại lý"
            style={{ width: 200 }}
            allowClear
          >
            <Option value="DL001">Đại lý VinFast Hà Nội</Option>
            <Option value="DL002">Đại lý VinFast Hồ Chí Minh</Option>
            <Option value="DL003">Đại lý VinFast Đà Nẵng</Option>
          </Select>
        </Space>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={vehicles}
            rowKey="id"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
          />
        )}
      </Card>
    </div>
  );
}