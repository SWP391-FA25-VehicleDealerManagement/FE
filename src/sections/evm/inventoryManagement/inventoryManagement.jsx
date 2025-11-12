import React, { useState, useEffect, useMemo } from "react";
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
import useInventoryStore from "../../../hooks/useInventory";
import useDealerStore from "../../../hooks/useDealer";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function InventoryManagement() {
  const {
    inventory,
    isLoading,
    fetchInventory,
  } = useInventoryStore();
  const { dealers, fetchDealers } = useDealerStore();
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("1");
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
      await Promise.all([fetchInventory(), fetchDealers()]);
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: "5%",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Mẫu xe",
      dataIndex: "modelName",
      key: "modelName",
      ...getColumnSearchProps("modelName"),
      width: "20%",
    },
    {
      title: "Phiên bản",
      dataIndex: "variantName",
      key: "variantName",
      ...getColumnSearchProps("variantName"),
      width: "20%",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      ...getColumnSearchProps("color"),
      width: "20%",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "15%",
      render: (quantity) => (
        <Text type={quantity < 5 ? "warning" : ""}>{quantity}</Text>
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
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <InboxOutlined style={{ marginRight: 8 }} /> Quản lý kho hàng
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Làm mới
          </Button>
        </Space>
      </div>

      {useMemo(() => {
        const totalVehicles = inventory.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        );
        const totalDealers = dealers.length;

        return (
          <Row gutter={16} className="mb-6">
            <Col span={12}>
              <Card hoverable>
                <Statistic
                  title="Tổng số lượng xe trong kho"
                  value={totalVehicles}
                  prefix={<CarOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card hoverable>
                <Statistic
                  title="Tổng số đại lý"
                  value={totalDealers}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ShopOutlined />}
                />
              </Card>
            </Col>
          </Row>
        );
      }, [inventory, dealers])}

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
                rowKey="index"
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
    </div>
  );
}
