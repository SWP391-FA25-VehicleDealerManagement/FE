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
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Steps,
  Divider,
  Alert,
  Tabs,
  Descriptions
} from "antd";
import {
  SearchOutlined,
  CarOutlined,
  ShopOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  ReloadOutlined,
  FileDoneOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

export default function VehicleAllocation() {
  const [inventory, setInventory] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [allocationHistory, setAllocationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [isAllocationModalVisible, setIsAllocationModalVisible] = useState(false);
  const [allocationForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  // Mock data for inventory available for allocation
  const mockInventory = [
    {
      id: "INV001",
      model: "VF8",
      color: "Đen",
      available: 20,
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      unitPrice: 1200000000,
    },
    {
      id: "INV002",
      model: "VF9",
      color: "Trắng",
      available: 13,
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      unitPrice: 1500000000,
    },
    {
      id: "INV003",
      model: "VF5",
      color: "Đỏ",
      available: 28,
      warehouseId: "WH002",
      warehouseName: "Kho Hồ Chí Minh",
      unitPrice: 800000000,
    },
    {
      id: "INV004",
      model: "VF6",
      color: "Xanh",
      available: 19,
      warehouseId: "WH002",
      warehouseName: "Kho Hồ Chí Minh",
      unitPrice: 950000000,
    },
  ];

  // Mock data for dealers
  const mockDealers = [
    {
      id: "DL001",
      name: "Đại lý VinFast Hà Nội",
      address: "235 Nguyễn Văn Cừ, Hà Nội",
      manager: "Nguyễn Văn A",
      phone: "0901234567",
      targetVehicles: 50,
      currentVehicles: 25,
      requestedVehicles: 10,
    },
    {
      id: "DL002",
      name: "Đại lý VinFast Hồ Chí Minh",
      address: "456 Võ Văn Kiệt, TP. HCM",
      manager: "Trần Thị B",
      phone: "0909876543",
      targetVehicles: 60,
      currentVehicles: 28,
      requestedVehicles: 15,
    },
    {
      id: "DL003",
      name: "Đại lý VinFast Đà Nẵng",
      address: "789 Ngô Quyền, Đà Nẵng",
      manager: "Lê Văn C",
      phone: "0905678901",
      targetVehicles: 40,
      currentVehicles: 18,
      requestedVehicles: 8,
    },
  ];

  // Mock data for allocation history
  const mockAllocationHistory = [
    {
      id: "AL001",
      inventoryId: "INV001",
      model: "VF8",
      color: "Đen",
      quantity: 3,
      dealerId: "DL001",
      dealerName: "Đại lý VinFast Hà Nội",
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      allocationDate: "2025-09-15",
      status: "completed",
      arrivalDate: "2025-09-18",
    },
    {
      id: "AL002",
      inventoryId: "INV002",
      model: "VF9",
      color: "Trắng",
      quantity: 2,
      dealerId: "DL002",
      dealerName: "Đại lý VinFast Hồ Chí Minh",
      warehouseId: "WH001",
      warehouseName: "Kho Hà Nội",
      allocationDate: "2025-09-20",
      status: "in_transit",
      estimatedArrival: "2025-09-25",
    },
    {
      id: "AL003",
      inventoryId: "INV003",
      model: "VF5",
      color: "Đỏ",
      quantity: 5,
      dealerId: "DL003",
      dealerName: "Đại lý VinFast Đà Nẵng",
      warehouseId: "WH002",
      warehouseName: "Kho Hồ Chí Minh",
      allocationDate: "2025-09-18",
      status: "pending",
      estimatedArrival: "2025-09-28",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInventory(mockInventory);
      setDealers(mockDealers);
      setAllocationHistory(mockAllocationHistory);
      setIsLoading(false);
    }, 1000);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const startAllocation = (inventoryItem) => {
    setSelectedInventory(inventoryItem);
    allocationForm.setFieldsValue({
      model: inventoryItem.model,
      color: inventoryItem.color,
      warehouseId: inventoryItem.warehouseId,
      warehouseName: inventoryItem.warehouseName,
      maxQuantity: inventoryItem.available,
    });
    setCurrentStep(0);
    setIsAllocationModalVisible(true);
  };

  const nextStep = () => {
    allocationForm.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAllocationSubmit = () => {
    allocationForm.validateFields().then((values) => {
      // Simulate API call
      setIsLoading(true);
      setTimeout(() => {
        // Update inventory
        const updatedInventory = inventory.map(item => {
          if (item.id === selectedInventory.id) {
            return {
              ...item,
              available: item.available - values.quantity
            };
          }
          return item;
        });
        setInventory(updatedInventory);

        // Add allocation history
        const newAllocation = {
          id: `AL${Math.floor(1000 + Math.random() * 9000)}`,
          inventoryId: selectedInventory.id,
          model: values.model,
          color: values.color,
          quantity: values.quantity,
          dealerId: values.dealerId,
          dealerName: dealers.find(dealer => dealer.id === values.dealerId)?.name,
          warehouseId: values.warehouseId,
          warehouseName: values.warehouseName,
          allocationDate: new Date().toISOString().split('T')[0],
          status: "pending",
          estimatedArrival: values.estimatedArrival?.format('YYYY-MM-DD') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        setAllocationHistory([newAllocation, ...allocationHistory]);

        // Update dealer info (in a real app, this would be a separate API call)
        const updatedDealers = dealers.map(dealer => {
          if (dealer.id === values.dealerId) {
            return {
              ...dealer,
              currentVehicles: dealer.currentVehicles + values.quantity,
              requestedVehicles: Math.max(0, dealer.requestedVehicles - values.quantity)
            };
          }
          return dealer;
        });
        setDealers(updatedDealers);

        setIsLoading(false);
        setIsAllocationModalVisible(false);
        allocationForm.resetFields();
        setCurrentStep(0);

        toast.success("Phân bổ xe thành công", {
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
      title: "Số lượng sẵn có",
      dataIndex: "available",
      key: "available",
      sorter: (a, b) => a.available - b.available,
      width: 150,
      render: (available) => (
        <Text type={available < 5 ? "warning" : ""}>{available}</Text>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      width: 150,
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<ExportOutlined />}
          onClick={() => startAllocation(record)}
          disabled={record.available <= 0}
        >
          Phân bổ
        </Button>
      ),
    },
  ];

  const dealerColumns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tên đại lý",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      width: 200,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
    {
      title: "Người quản lý",
      dataIndex: "manager",
      key: "manager",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Tiến độ",
      key: "progress",
      width: 200,
      render: (_, record) => (
        <div>
          <Progress
            percent={Math.round((record.currentVehicles / record.targetVehicles) * 100)}
            size="small"
            status={
              record.currentVehicles >= record.targetVehicles
                ? "success"
                : "active"
            }
          />
          <div className="text-xs mt-1">
            {record.currentVehicles}/{record.targetVehicles} xe ({Math.round((record.currentVehicles / record.targetVehicles) * 100)}%)
          </div>
        </div>
      ),
    },
    {
      title: "Yêu cầu thêm",
      dataIndex: "requestedVehicles",
      key: "requestedVehicles",
      width: 120,
      render: (value) => (
        value > 0 ? <Tag color="volcano">{value} xe</Tag> : <Tag color="green">0 xe</Tag>
      )
    },
  ];

  const historyColumns = [
    {
      title: "Mã phân bổ",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 100,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 100,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Từ kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      width: 150,
    },
    {
      title: "Đến đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      width: 150,
    },
    {
      title: "Ngày phân bổ",
      dataIndex: "allocationDate",
      key: "allocationDate",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.allocationDate) - new Date(b.allocationDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        let color = "";
        let icon = null;
        let text = "";
        
        switch (status) {
          case "completed":
            color = "success";
            icon = <CheckCircleOutlined />;
            text = "Hoàn thành";
            break;
          case "in_transit":
            color = "processing";
            icon = <SyncOutlined spin />;
            text = "Đang vận chuyển";
            break;
          case "pending":
            color = "warning";
            icon = <ClockCircleOutlined />;
            text = "Đang xử lý";
            break;
          default:
            color = "default";
            text = status;
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: "Hoàn thành", value: "completed" },
        { text: "Đang vận chuyển", value: "in_transit" },
        { text: "Đang xử lý", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày đến (dự kiến)",
      key: "arrivalDate",
      width: 150,
      render: (_, record) => {
        const date = record.arrivalDate || record.estimatedArrival;
        return date ? new Date(date).toLocaleDateString("vi-VN") : "N/A";
      }
    },
  ];

  const AllocationSteps = () => (
    <Steps current={currentStep} style={{ marginBottom: 20 }}>
      <Step title="Chọn đại lý" description="Chọn đại lý nhận xe" />
      <Step title="Thông tin phân bổ" description="Nhập thông tin chi tiết" />
      <Step title="Xác nhận" description="Xác nhận thông tin" />
    </Steps>
  );

  const AllocationStep1 = () => (
    <Form.Item
      name="dealerId"
      label="Chọn đại lý"
      rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
    >
      <Select placeholder="Chọn đại lý">
        {dealers.map((dealer) => (
          <Option key={dealer.id} value={dealer.id}>
            {dealer.name} - {dealer.address}
            {dealer.requestedVehicles > 0 && (
              <Tag color="volcano" style={{ marginLeft: 8 }}>Yêu cầu: {dealer.requestedVehicles}</Tag>
            )}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  const AllocationStep2 = () => (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="model"
            label="Model xe"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="warehouseName"
            label="Kho xuất"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="maxQuantity"
            label="Số lượng có sẵn"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="quantity"
        label="Số lượng phân bổ"
        rules={[
          { required: true, message: "Vui lòng nhập số lượng phân bổ" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || (value <= getFieldValue('maxQuantity') && value > 0)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(`Số lượng phải từ 1 đến ${getFieldValue('maxQuantity')}`));
            }
          })
        ]}
      >
        <InputNumber min={1} max={allocationForm.getFieldValue('maxQuantity')} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="estimatedArrival"
        label="Ngày đến dự kiến"
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="note"
        label="Ghi chú"
      >
        <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
      </Form.Item>
    </>
  );

  const AllocationStep3 = () => {
    const values = allocationForm.getFieldsValue();
    const selectedDealer = dealers.find(dealer => dealer.id === values.dealerId);
    
    return (
      <div>
        <Alert
          message="Xác nhận thông tin phân bổ"
          description="Vui lòng kiểm tra kỹ thông tin trước khi xác nhận phân bổ xe."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Descriptions title="Thông tin phân bổ" bordered>
          <Descriptions.Item label="Model xe" span={3}>{values.model}</Descriptions.Item>
          <Descriptions.Item label="Màu sắc" span={3}>{values.color}</Descriptions.Item>
          <Descriptions.Item label="Kho xuất" span={3}>{values.warehouseName}</Descriptions.Item>
          <Descriptions.Item label="Đại lý" span={3}>{selectedDealer?.name}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ đại lý" span={3}>{selectedDealer?.address}</Descriptions.Item>
          <Descriptions.Item label="Số lượng phân bổ" span={3}>
            <Text strong>{values.quantity}</Text> (Còn lại sau phân bổ: {values.maxQuantity - values.quantity})
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đến dự kiến" span={3}>
            {values.estimatedArrival ? values.estimatedArrival.format('DD/MM/YYYY') : 'Chưa xác định'}
          </Descriptions.Item>
          {values.note && (
            <Descriptions.Item label="Ghi chú" span={3}>{values.note}</Descriptions.Item>
          )}
        </Descriptions>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <SwapOutlined style={{ marginRight: 8 }} /> Phân bổ xe cho đại lý
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số xe sẵn có để phân bổ"
              value={inventory.reduce((sum, item) => sum + item.available, 0)}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số đại lý"
              value={dealers.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Yêu cầu xe chưa xử lý"
              value={dealers.reduce((sum, dealer) => sum + dealer.requestedVehicles, 0)}
              valueStyle={{ color: '#faad14' }}
              prefix={<FileDoneOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <CarOutlined /> Xe có sẵn để phân bổ
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
                dataSource={inventory}
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
                <ShopOutlined /> Danh sách đại lý
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
                columns={dealerColumns}
                dataSource={dealers}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                scroll={{ x: 1200 }}
              />
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <HistoryOutlined /> Lịch sử phân bổ
              </span>
            }
            key="3"
          >
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={historyColumns}
                dataSource={allocationHistory}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                scroll={{ x: 1500 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal phân bổ xe */}
      <Modal
        title="Phân bổ xe cho đại lý"
        open={isAllocationModalVisible}
        footer={[
          <Button key="cancel" onClick={() => setIsAllocationModalVisible(false)}>
            Hủy
          </Button>,
          currentStep > 0 && (
            <Button key="back" onClick={prevStep}>
              Quay lại
            </Button>
          ),
          currentStep < 2 ? (
            <Button key="next" type="primary" onClick={nextStep}>
              Tiếp tục
            </Button>
          ) : (
            <Button key="submit" type="primary" onClick={handleAllocationSubmit} loading={isLoading}>
              Xác nhận phân bổ
            </Button>
          )
        ]}
        onCancel={() => setIsAllocationModalVisible(false)}
        width={700}
      >
        <AllocationSteps />
        <Divider />
        <Form form={allocationForm} layout="vertical">
          <Form.Item name="warehouseId" hidden>
            <Input />
          </Form.Item>
          
          {currentStep === 0 && <AllocationStep1 />}
          {currentStep === 1 && <AllocationStep2 />}
          {currentStep === 2 && <AllocationStep3 />}
        </Form>
      </Modal>
    </div>
  );
}