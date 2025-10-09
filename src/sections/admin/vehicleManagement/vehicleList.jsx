import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Spin,
  Modal,
  Tag,
  Select,
  Form,
  InputNumber
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  CarOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;
const { Option } = Select;

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
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
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showDeleteConfirm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;

    // Simulate delete API call
    setIsLoading(true);
    setTimeout(() => {
      const updatedVehicles = vehicles.filter(v => v.id !== selectedVehicle.id);
      setVehicles(updatedVehicles);
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
      
      toast.success("Xóa phương tiện thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleAddSubmit = () => {
    form.validateFields().then((values) => {
      // Simulate adding a new vehicle
      setIsLoading(true);
      
      setTimeout(() => {
        const newVehicle = {
          id: `VF${Math.floor(1000 + Math.random() * 9000)}`,
          ...values,
          status: "available",
          manufactureDate: new Date().toISOString().split('T')[0],
        };
        
        setVehicles([...vehicles, newVehicle]);
        setIsLoading(false);
        setIsAddModalOpen(false);
        form.resetFields();
        
        toast.success("Thêm phương tiện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }, 1000);
    });
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
    // {
    //   title: "Đại lý",
    //   dataIndex: "dealerName",
    //   key: "dealerName",
    //   ...getColumnSearchProps("dealerName"),
    //   sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    // },
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
        <Space size="middle">
          <Link to={`/admin/vehicles/${record.id}`}>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
            >
              Chi tiết
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <CarOutlined style={{ marginRight: 8 }} /> Quản lý phương tiện
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          Thêm phương tiện mới
        </Button>
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

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa phương tiện"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa phương tiện{" "}
          <strong>{selectedVehicle?.id} - {selectedVehicle?.model}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Modal thêm phương tiện mới */}
      <Modal
        title="Thêm phương tiện mới"
        open={isAddModalOpen}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        okText="Thêm"
        cancelText="Hủy"
        closable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Vui lòng nhập model xe" }]}
          >
            <Select placeholder="Chọn model xe">
              <Option value="VF5">VF5</Option>
              <Option value="VF6">VF6</Option>
              <Option value="VF7">VF7</Option>
              <Option value="VF8">VF8</Option>
              <Option value="VF9">VF9</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
          >
            <Select placeholder="Chọn màu sắc">
              <Option value="Đen">Đen</Option>
              <Option value="Trắng">Trắng</Option>
              <Option value="Đỏ">Đỏ</Option>
              <Option value="Xanh">Xanh</Option>
              <Option value="Xám">Xám</Option>
              <Option value="Bạc">Bạc</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá xe" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá xe"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="year"
            label="Năm sản xuất"
            rules={[{ required: true, message: "Vui lòng nhập năm sản xuất" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập năm sản xuất"
              min={2020}
              max={new Date().getFullYear()}
            />
          </Form.Item>

          <Form.Item
            name="dealerId"
            label="Đại lý"
            rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
          >
            <Select placeholder="Chọn đại lý">
              <Option value="DL001">Đại lý VinFast Hà Nội</Option>
              <Option value="DL002">Đại lý VinFast Hồ Chí Minh</Option>
              <Option value="DL003">Đại lý VinFast Đà Nẵng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
