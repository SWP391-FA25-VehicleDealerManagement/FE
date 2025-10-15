import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Spin,
  Tag,
  Select,
  Row,
  Col,
  Statistic,
  Progress,
  Tabs,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Divider,
} from "antd";
import {
  SearchOutlined,
  CarOutlined,
  BarChartOutlined,
  InboxOutlined,
  ImportOutlined,
  ExportOutlined,
  ReloadOutlined,
  PlusOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function InventoryManagement() {
  const [inventoryData, setInventoryData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  // Mock data for inventory
  const mockInventory = [
    {
      id: "INV001",
      model: "VF8",
      color: "Đen",
      quantity: 25,
      available: 20,
      allocated: 5,
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      lastUpdated: "2025-09-15",
      totalValue: 30000000000,
    },
    {
      id: "INV002",
      model: "VF9",
      color: "Trắng",
      quantity: 18,
      available: 13,
      allocated: 5,
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      lastUpdated: "2025-09-20",
      totalValue: 27000000000,
    },
    {
      id: "INV003",
      model: "VF5",
      color: "Đỏ",
      quantity: 30,
      available: 28,
      allocated: 2,
      warehouseId: "WH002",
      warehouseName: "Kho Hồ Chí Minh",
      lastUpdated: "2025-09-18",
      totalValue: 24000000000,
    },
    {
      id: "INV004",
      model: "VF6",
      color: "Xanh",
      quantity: 22,
      available: 19,
      allocated: 3,
      warehouseId: "WH002",
      warehouseName: "Kho Hồ Chí Minh",
      lastUpdated: "2025-09-22",
      totalValue: 20900000000,
    },
  ];

  // Mock data for warehouses
  const mockWarehouses = [
    {
      id: "WH001",
      name: "Kho Hà Nội",
      location: "KCN Thăng Long, Hà Nội",
      capacity: 100,
      used: 43,
      models: ["VF8", "VF9", "VF5"],
      manager: "Nguyễn Văn A",
      contactNumber: "0901234567",
    },
    {
      id: "WH002",
      name: "Kho Hồ Chí Minh",
      location: "KCN Tân Phú, TP.HCM",
      capacity: 120,
      used: 52,
      models: ["VF6", "VF5", "VF9"],
      manager: "Trần Thị B",
      contactNumber: "0909876543",
    },
    {
      id: "WH003",
      name: "Kho Đà Nẵng",
      location: "KCN Hòa Khánh, Đà Nẵng",
      capacity: 80,
      used: 32,
      models: ["VF7", "VF8", "VF6"],
      manager: "Lê Văn C",
      contactNumber: "0905678901",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    // Simulate API call with delay
    setTimeout(() => {
      setInventoryData(mockInventory);
      setWarehouseData(mockWarehouses);
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

  const handleImportSubmit = () => {
    importForm.validateFields().then((values) => {
      // Simulate API call
      setIsLoading(true);
      setTimeout(() => {
        const updatedInventory = [...inventoryData];
        const itemIndex = updatedInventory.findIndex(
          (item) =>
            item.model === values.model &&
            item.color === values.color &&
            item.warehouseId === values.warehouseId
        );

        if (itemIndex >= 0) {
          // Update existing item
          updatedInventory[itemIndex].quantity += values.quantity;
          updatedInventory[itemIndex].available += values.quantity;
          updatedInventory[itemIndex].lastUpdated = new Date()
            .toISOString()
            .split("T")[0];
        } else {
          // Create new inventory item
          const newItem = {
            id: `INV${Math.floor(1000 + Math.random() * 9000)}`,
            model: values.model,
            color: values.color,
            quantity: values.quantity,
            available: values.quantity,
            allocated: 0,
            warehouseId: values.warehouseId,
            warehouseName:
              warehouseData.find((w) => w.id === values.warehouseId)?.name ||
              "",
            lastUpdated: new Date().toISOString().split("T")[0],
            totalValue: values.totalValue || 0,
          };
          updatedInventory.push(newItem);
        }

        setInventoryData(updatedInventory);
        setIsLoading(false);
        setIsImportModalVisible(false);
        importForm.resetFields();

        toast.success("Nhập kho thành công", {
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

  const inventoryColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
      width: 100,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      filters: [
        { text: "VF5", value: "VF5" },
        { text: "VF6", value: "VF6" },
        { text: "VF7", value: "VF7" },
        { text: "VF8", value: "VF8" },
        { text: "VF9", value: "VF9" },
      ],
      onFilter: (value, record) => record.model === value,
      width: 100,
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
      width: 100,
    },
    {
      title: "Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      ...getColumnSearchProps("warehouseName"),
      width: 150,
    },
    {
      title: "Tổng số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
    },
    {
      title: "Còn trống",
      dataIndex: "available",
      key: "available",
      sorter: (a, b) => a.available - b.available,
      width: 120,
      render: (available, record) => (
        <Text type={available < 5 ? "warning" : ""}>{available}</Text>
      ),
    },
    {
      title: "Đã phân bổ",
      dataIndex: "allocated",
      key: "allocated",
      width: 120,
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
      width: 150,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<ImportOutlined />}
            onClick={() => {
              importForm.setFieldsValue({
                model: record.model,
                color: record.color,
                warehouseId: record.warehouseId,
              });
              setIsImportModalVisible(true);
            }}
          >
            Nhập thêm
          </Button>
        </Space>
      ),
    },
  ];

  const warehouseColumns = [
    {
      title: "Mã kho",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tên kho",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "location",
      key: "location",
      ...getColumnSearchProps("location"),
      width: 200,
    },
    {
      title: "Người quản lý",
      dataIndex: "manager",
      key: "manager",
      width: 150,
    },
    {
      title: "Liên hệ",
      dataIndex: "contactNumber",
      key: "contactNumber",
      width: 150,
    },
    {
      title: "Sử dụng/Sức chứa",
      key: "capacity",
      width: 200,
      render: (_, record) => (
        <div>
          <Progress
            percent={Math.round((record.used / record.capacity) * 100)}
            size="small"
            status={
              record.used / record.capacity > 0.9
                ? "exception"
                : record.used / record.capacity > 0.7
                ? "warning"
                : "normal"
            }
          />
          <div className="text-xs mt-1">
            {record.used}/{record.capacity} xe (
            {Math.round((record.used / record.capacity) * 100)}%)
          </div>
        </div>
      ),
    },
    {
      title: "Các model xe",
      dataIndex: "models",
      key: "models",
      width: 200,
      render: (models) => (
        <div className="flex flex-wrap gap-1">
          {models.map((model) => (
            <Tag key={model} color="blue">
              {model}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <InboxOutlined style={{ marginRight: 8 }} /> Quản lý kho hàng
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<ImportOutlined />}
            onClick={() => setIsImportModalVisible(true)}
          >
            Nhập kho mới
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số lượng xe trong kho"
              value={inventoryData.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số lượng xe sẵn có"
              value={inventoryData.reduce(
                (sum, item) => sum + item.available,
                0
              )}
              valueStyle={{ color: "#3f8600" }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Số lượng xe đã phân bổ"
              value={inventoryData.reduce(
                (sum, item) => sum + item.allocated,
                0
              )}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExportOutlined />}
            />
          </Card>
        </Col>
        <Col span={7}>
          <Card>
            <Statistic
              title="Tổng giá trị hàng tồn kho"
              value={inventoryData.reduce(
                (sum, item) => sum + item.totalValue,
                0
              )}
              precision={0}
              valueStyle={{ color: "#4BBF6B" }}
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <CarOutlined /> Danh sách tồn kho
              </span>
            }
            key="1"
          >
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={inventoryColumns}
                dataSource={inventoryData}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="id"
                scroll={{ x: 1200 }}
              />
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <InboxOutlined /> Danh sách kho hàng
              </span>
            }
            key="2"
          >
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={warehouseColumns}
                dataSource={warehouseData}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                scroll={{ x: 1200 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal nhập kho */}
      <Modal
        title="Nhập kho"
        open={isImportModalVisible}
        onOk={handleImportSubmit}
        onCancel={() => setIsImportModalVisible(false)}
        okText="Nhập kho"
        cancelText="Hủy"
        confirmLoading={isLoading}
      >
        <Form form={importForm} layout="vertical">
          <Form.Item
            name="model"
            label="Model xe"
            rules={[{ required: true, message: "Vui lòng chọn model xe" }]}
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
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="warehouseId"
            label="Kho hàng"
            rules={[{ required: true, message: "Vui lòng chọn kho hàng" }]}
          >
            <Select placeholder="Chọn kho hàng">
              {warehouseData.map((warehouse) => (
                <Option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="importDate"
            label="Ngày nhập"
            initialValue={dayjs(new Date())}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" minDate={dayjs(new Date())} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
