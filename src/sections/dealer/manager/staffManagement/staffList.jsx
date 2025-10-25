import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, Typography, Spin, Modal } from "antd";
import { SearchOutlined, UserAddOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import useStaffStore from "../../../../hooks/useDealerStaff";   
import CreateStaffModal from "./createStaffModal";        

const { Title } = Typography;

export default function StaffList() {
  const { staffs, isLoading, fetchStaffs, deleteStaff } = useStaffStore();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  useEffect(() => { fetchStaffs(); }, [fetchStaffs]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => { confirm(); setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); }}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" onClick={() => { confirm(); setSearchText(selectedKeys[0]); setSearchedColumn(dataIndex); }} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Tìm kiếm
          </Button>
          <Button onClick={() => { clearFilters(); setSearchText(""); }} size="small" style={{ width: 90 }}>
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) => record[dataIndex]?.toString()?.toLowerCase().includes(value.toLowerCase()),
  });

  const columns = [
    { title: "ID", dataIndex: "staffId", key: "staffId", sorter: (a, b) => a.staffId - b.staffId },
    { title: "Tên Nhân viên", dataIndex: "staffName", key: "staffName", ...getColumnSearchProps("staffName"), sorter: (a, b) => a.staffName.localeCompare(b.staffName), render: (t) => <a>{t}</a> },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone", ...getColumnSearchProps("phone") },
    { title: "Địa chỉ", dataIndex: "address", key: "address", ...getColumnSearchProps("address") },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dealer-manager/staff/${record.staffId}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">Xem</Button>
          </Link>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => { setSelectedStaff(record); setIsDeleteOpen(true); }}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Danh sách Nhân viên</Title>
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setIsCreateModalOpen(true)}>
          Thêm Nhân viên mới
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10"><Spin size="large" /></div>
        ) : (
          <Table
            columns={columns}
            dataSource={staffs}
            rowKey="staffId"
            pagination={pagination}
            onChange={(pg) => setPagination(pg)}
          />
        )}
      </Card>

      {/* Confirm delete */}
      <Modal
        title="Xác nhận xóa nhân viên"
        open={isDeleteOpen}                 // AntD v5
        onOk={async () => { await deleteStaff(selectedStaff?.staffId); setIsDeleteOpen(false); setSelectedStaff(null); fetchStaffs(); }}
        onCancel={() => { setIsDeleteOpen(false); setSelectedStaff(null); }}
        okText="Xóa" cancelText="Hủy" okType="danger" closable={false}
      >
        <p>Bạn có chắc chắn muốn xóa nhân viên <strong>{selectedStaff?.staffName}</strong> không?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Create Staff */}
      <CreateStaffModal
        isOpen={isCreateModalOpen}          // truyền đúng prop
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchStaffs()}
      />
    </div>
  );
}
