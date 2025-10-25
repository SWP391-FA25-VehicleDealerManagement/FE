import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, Typography, Spin, Modal } from "antd";
import { SearchOutlined, UserAddOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useCustomerStore from "../../../../hooks/useCustomer";
import CreateCustomerModal from "./createCustomerModal";

const { Title } = Typography;

export default function CustomerList() {
  const { customers, isLoading, fetchCustomers, deleteCustomer } = useCustomerStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clear) => { clear(); setSearchText(""); };

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
          <Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Tìm kiếm</Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>Đặt lại</Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (v, r) => r[dataIndex]?.toString().toLowerCase().includes(v.toLowerCase()),
  });

  const columns = [
    { title: "ID", dataIndex: "customerId", key: "customerId", sorter: (a,b)=>a.customerId-b.customerId },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName", ...getColSearch("customerName"), sorter: (a,b)=>a.customerName.localeCompare(b.customerName) },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone", ...getColSearch("phone") },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ...getColSearch("address") },
    {
      title: "Thao tác", key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dealer-staff/customers/${record.customerId}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">Xem</Button>
          </Link>
          <Button danger icon={<DeleteOutlined />} size="small"
            onClick={() => { setSelected(record); setIsDeleteOpen(true); }}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Danh sách Khách hàng</Title>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsCreateOpen(true)}>Thêm Khách hàng</Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10"><Spin size="large" /></div>
        ) : (
          <Table columns={columns} dataSource={customers} rowKey="customerId"
                 pagination={{ pageSize: 10, showSizeChanger: true,
                   showTotal: (t, r) => `${r[0]}-${r[1]} của ${t} mục` }} />
        )}
      </Card>

      <Modal title="Xác nhận xóa khách hàng" open={isDeleteOpen}
             onOk={async () => { await deleteCustomer(selected?.customerId); setIsDeleteOpen(false); setSelected(null); fetchCustomers(); }}
             onCancel={() => { setIsDeleteOpen(false); setSelected(null); }}
             okText="Xóa" cancelText="Hủy" okType="danger" closable={false}>
        <p>Bạn có chắc muốn xóa <strong>{selected?.customerName}</strong> không?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      <CreateCustomerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchCustomers()}
      />
    </div>
  );
}
