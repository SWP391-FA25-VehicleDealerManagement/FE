import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, Typography, Spin } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useCustomerStore from "../../../../hooks/useCustomer";

const { Title } = Typography;

export default function CustomerList() {
  const { customers, isLoading, fetchCustomers } = useCustomerStore();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ----- Search & Filter -----
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColSearch = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });
  // ----------------------------

  // ----- Cấu hình cột bảng -----
  const columns = [
    {
      title: "ID",
      dataIndex: "customerId",
      key: "customerId",
      sorter: (a, b) => a.customerId - b.customerId,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      ...getColSearch("customerName"),
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      ...getColSearch("phone"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColSearch("address"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dealer-manager/customer-list/${record.customerId}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              Xem
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
  // ----------------------------

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Danh sách Khách hàng</Title>
      </div>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="customerId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
            }}
          />
        )}
      </Card>
    </div>
  );
}
