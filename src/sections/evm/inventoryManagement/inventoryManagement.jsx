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
  ShopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useInventoryStore from "../../../hooks/useInventory";
import useDealerStore from "../../../hooks/useDealer";
import useVehicleStore from "../../../hooks/useVehicle";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function InventoryManagement() {
  const {
    inventory,
    isLoading,
    fetchInventory,
    importInventory,
    updateInventory,
    deleteInventoryById,
  } = useInventoryStore();
  const { dealers, fetchDealers } = useDealerStore();
  const { vehicles, fetchVehicles } = useVehicleStore();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [isAddMoreModalVisible, setIsAddMoreModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [importForm] = Form.useForm();
  const [addMoreForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchInventory(), fetchDealers(), fetchVehicles()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleImportSubmit = async () => {
    try {
      const values = await importForm.validateFields();

      // Find the selected vehicle and dealer objects
      const selectedVehicle = vehicles.find(
        (v) => v.vehicleId === values.vehicleId
      );

      if (!selectedVehicle) {
        toast.error("Không tìm thấy thông tin xe", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const importData = {
        vehicle: {
          vehicleId: selectedVehicle.vehicleId,
          name: selectedVehicle.name,
          color: selectedVehicle.color,
          image: selectedVehicle.image,
          price: selectedVehicle.price,
          stock: selectedVehicle.stock,
          variant: selectedVehicle.variant,
          // dealer: selectedVehicle.dealer,
          status: selectedVehicle.status,
        },
        quantity: values.quantity,
        status: "AVAILABLE",
      };

      const response = await importInventory(importData);

      if (response && response.status === 200) {
        toast.success("Nhập kho thành công", {
          position: "top-right",
          autoClose: 3000,
        });

        setIsImportModalVisible(false);
        importForm.resetFields();
        await fetchInventory(); // Refresh data
      }
    } catch (error) {
      console.error("Error importing inventory:", error);
      toast.error(error.response?.data?.message || "Nhập kho thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleAddMoreSubmit = async () => {
    try {
      const values = await addMoreForm.validateFields();

      if (!selectedInventoryItem) {
        toast.error("Không tìm thấy thông tin xe", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Tính tổng số lượng mới = số lượng hiện tại + số lượng thêm
      const newTotalQuantity =
        selectedInventoryItem.quantity + values.addQuantity;

      const updateData = {
        quantity: newTotalQuantity,
        status: "AVAILABLE",
      };

      const response = await updateInventory(
        selectedInventoryItem.stockId,
        updateData
      );

      if (response && response.status === 200) {
        toast.success(
          `Nhập thêm kho thành công! Số lượng mới: ${newTotalQuantity}`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );

        setIsAddMoreModalVisible(false);
        setSelectedInventoryItem(null);
        addMoreForm.resetFields();
        await fetchInventory(); // Refresh data
      }
    } catch (error) {
      console.error("Error adding more inventory:", error);
      toast.error(error.response?.data?.message || "Nhập thêm kho thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const showDeleteConfirm = (record) => {
    setItemToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteStock = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteInventoryById(itemToDelete.inventoryId);

      if (response && response.status === 200) {
        toast.success("Xóa kho thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        setIsDeleteModalVisible(false);
        setItemToDelete(null);
        await fetchInventory(); // Refresh data
      } else {
        toast.error(response.data.message || "Xóa kho thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error deleting inventory:", error);
      toast.error(error.response?.data?.message || "Xóa kho thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
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
      dataIndex: "manufacturerStockId",
      key: "manufacturerStockId",
      ...getColumnSearchProps("manufacturerStockId"),
      width: 100,
    },
    {
      title: "Mẫu xe",
      dataIndex: "modelName",
      key: "modelName",
      ...getColumnSearchProps("modelName"),
      width: 200,
    },
    {
      title: "Phiên bản",
      dataIndex: "variantName",
      key: "variantName",
      ...getColumnSearchProps("variantName"),
      width: 150,
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
      width: 150,
    },
    {
      title: "Kho",
      dataIndex: "dealerName",
      key: "dealerName",
      ...getColumnSearchProps("dealerName"),
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "10%",
      render: (quantity) => (
        <Text type={quantity < 5 ? "warning" : ""}>{quantity}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Có sẵn", value: "AVAILABLE" },
        { text: "Đã đặt trước", value: "RESERVED" },
        { text: "Đã bán", value: "SOLD" },
        { text: "Đang vận chuyển", value: "IN_TRANSIT" },
        { text: "Bảo trì", value: "MAINTENANCE" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let color = "default";
        let text = status;
        switch (status) {
          case "AVAILABLE":
            color = "green";
            text = "Có sẵn";
            break;
          case "RESERVED":
            color = "blue";
            text = "Đã đặt trước";
            break;
          case "SOLD":
            color = "red";
            text = "Đã bán";
            break;
          case "IN_TRANSIT":
            color = "orange";
            text = "Đang vận chuyển";
            break;
          case "MAINTENANCE":
            color = "purple";
            text = "Bảo trì";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<ImportOutlined />}
            onClick={() => {
              setSelectedInventoryItem(record);
              setIsAddMoreModalVisible(true);
            }}
          >
            Nhập thêm
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const warehouseColumns = [
    {
      title: "Mã đại lý",
      dataIndex: "dealerId",
      key: "dealerId",
      width: 100,
    },
    {
      title: "Tên đại lý",
      dataIndex: "dealerName",
      key: "dealerName",
      ...getColumnSearchProps("dealerName"),
      width: 200,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      width: 300,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "Tổng xe trong kho",
      key: "totalVehicles",
      width: 150,
      render: (_, record) => {
        const dealerInventory = inventory.filter(
          (item) => item.dealerId === record.dealerId
        );
        const total = dealerInventory.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        return <Tag color="blue">{total} xe</Tag>;
      },
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
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số lượng xe trong kho"
              value={inventory.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
              )}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Số lượng xe sẵn có"
              value={inventory
                .filter((item) => item.status === "AVAILABLE")
                .reduce((sum, item) => sum + (item.quantity || 0), 0)}
              valueStyle={{ color: "#3f8600" }}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số đại lý"
              value={dealers.length}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ShopOutlined />}
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
                dataSource={inventory}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="stockId"
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
                columns={warehouseColumns}
                dataSource={dealers}
                pagination={pagination}
                onChange={(pagination) => setPagination(pagination)}
                rowKey="dealerId"
                scroll={{ x: 1000 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Nhập kho"
        open={isImportModalVisible}
        onOk={handleImportSubmit}
        onCancel={() => {
          setIsImportModalVisible(false);
          importForm.resetFields();
        }}
        okText="Nhập kho"
        cancelText="Hủy"
        confirmLoading={isLoading}
      >
        <Form form={importForm} layout="vertical">
          <Form.Item
            name="vehicleId"
            label="Xe"
            rules={[{ required: true, message: "Vui lòng chọn xe" }]}
          >
            <Select
              placeholder="Chọn xe"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={vehicles.map((vehicle) => ({
                value: vehicle.vehicleId,
                label: `${vehicle.name} - ${vehicle.modelName} (${vehicle.variantName})`,
              }))}
            />
          </Form.Item>

          {/* <Form.Item
            name="dealerId"
            label="Đại lý"
            rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
          >
            <Select 
              placeholder="Chọn đại lý"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={dealers.map(dealer => ({
                value: dealer.dealerId,
                label: dealer.dealerName,
              }))}
            />
          </Form.Item> */}

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0" },
            ]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng"
            />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Nhập thêm xe vào kho"
        open={isAddMoreModalVisible}
        onOk={handleAddMoreSubmit}
        onCancel={() => {
          setIsAddMoreModalVisible(false);
          setSelectedInventoryItem(null);
          addMoreForm.resetFields();
        }}
        okText="Nhập thêm"
        cancelText="Hủy"
        confirmLoading={isLoading}
        width={600}
      >
        {selectedInventoryItem && (
          <Form form={addMoreForm} layout="vertical">
            <Divider orientation="center" className="py-2">
              Thông tin xe
            </Divider>

            <Row gutter={16}>
              {/* <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tên xe: </Text>
                  <Text>{selectedInventoryItem.vehicleName}</Text>
                </div>
              </Col> */}
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Model: </Text>
                  <Text>{selectedInventoryItem.modelName}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Phiên bản: </Text>
                  <Text>{selectedInventoryItem.variantName}</Text>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Phiên bản: </Text>
                  <Text>{selectedInventoryItem.variantName}</Text>
                </div>
              </Col> */}
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Kho: </Text>
                  <Text>{selectedInventoryItem.dealerName}</Text>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Số lượng hiện tại: </Text>
                  <Text
                    type="success"
                    style={{ fontSize: 16, fontWeight: "bold" }}
                  >
                    {selectedInventoryItem.quantity}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Trạng thái: </Text>
                  <Tag color="green">{selectedInventoryItem.status}</Tag>
                </div>
              </Col>
            </Row>

            <Divider orientation="center" className="py-2">
              Nhập thêm số lượng
            </Divider>

            <Form.Item
              name="addQuantity"
              label="Số lượng cần nhập thêm"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng" },
                { type: "number", min: 1, message: "Số lượng phải lớn hơn 0" },
              ]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Nhập số lượng cần thêm"
                size="large"
              />
            </Form.Item>

            <Form.Item name="addNote" label="Ghi chú">
              <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa kho"
        open={isDeleteModalVisible}
        onOk={handleDeleteStock}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
        confirmLoading={isDeleting}
      >
        {itemToDelete && (
          <div>
            <p>Bạn có chắc chắn muốn xóa?</p>
            <p>
              <p>
                <strong>Model:</strong> {itemToDelete.modelName}
              </p>
              <strong>Loại xe:</strong> {itemToDelete.variantName}
            </p>
            <p>
              <strong>Kho:</strong> {itemToDelete.dealerName}
            </p>
            <p>
              <strong>Số lượng:</strong> {itemToDelete.quantity}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
