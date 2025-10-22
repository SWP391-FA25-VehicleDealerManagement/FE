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
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useDealerInventory from "../../../../hooks/useDealerInventory";

const { Title, Text } = Typography;

export default function InventoryList() {
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
      await fetchDealerInventory();
    } catch (error) {
      console.error("Error fetching dealer inventory:", error);
      toast.error("Không thể tải dữ liệu kho hàng", {
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
      title: "Mã",
      dataIndex: "stockId",
      key: "stockId",
      ...getColumnSearchProps("stockId"),
      width: 100,
      fixed: "left",
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
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      width: 120,
      render: (quantity) => (
        <Text type={quantity < 5 ? "warning" : ""}>{quantity}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
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
  ];

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
        <Col span={12}>
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
        <Col span={12}>
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
