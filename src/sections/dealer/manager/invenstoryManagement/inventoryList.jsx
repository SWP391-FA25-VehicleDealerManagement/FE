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
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  CarOutlined,
  InboxOutlined,
  ReloadOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useDealerInventory from "../../../../hooks/useDealerInventory";
import useAuthen from "../../../../hooks/useAuthen";

const { Title, Text } = Typography;

export default function InventoryList() {
  const { userDetail } = useAuthen();
  const dealerId = userDetail?.dealer?.dealerId;
  const { inventory, isLoading, fetchDealerInventory } = useDealerInventory();
  const [searchText, setSearchText] = useState("");
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
      await fetchDealerInventory(dealerId);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      toast.error(
        error.response?.data?.message || "Lấy dữ liệu kho hàng thất bại!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        }
      );
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: "20%",
      render: (quantity) => (
        <Text type={quantity < 2 ? "danger" : ""}>
          {quantity} - Phương tiện sắp hết
        </Text>
      ),
    },
  ];

  const totalQuantity = inventory.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const totalStockItems = inventory.length; // Tổng số loại xe (SKUs)
  const totalUniqueModels = new Set(inventory.map((item) => item.modelName))
    .size;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <InboxOutlined style={{ marginRight: 8 }} /> Kho hàng đại lý
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Làm mới
          </Button>
        </Space>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={12} className="mb-4 md:mb-0">
          <Card hoverable>
            <Statistic
              title="Tổng số lượng xe"
              value={totalQuantity}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable>
            <Statistic
              title="Số mẫu xe"
              value={totalUniqueModels}
              prefix={<TagsOutlined />} 
              valueStyle={{ color: "#d46b08" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
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
            scroll={{ x: 1000 }}
          />
        )}
      </Card>
    </div>
  );
}
