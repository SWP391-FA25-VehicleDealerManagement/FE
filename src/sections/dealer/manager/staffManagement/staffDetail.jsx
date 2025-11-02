import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useDealerStaff from "../../../../hooks/useDealerStaff";
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Table,
  Tag,
  Typography,
  Spin,
  Avatar,
  Row,
  Col,
  Divider,
  Space,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

export default function StaffDetail() {
  const { staffId } = useParams();
  const { staffDetail, isLoading, fetchStaffById, deleteStaff } = useDealerStaff();

  const [activeTab, setActiveTab] = useState("1");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false); // để dành khi có UpdateStaffModal

  // Gọi API detail (API user-account thường là /api/users/{id} -> userId)
  useEffect(() => {
    if (staffId) fetchStaffById(staffId);
  }, [staffId, fetchStaffById]);

  // Chuẩn hoá và fallback dữ liệu để không bị "—"
  const normalized = useMemo(() => {
    const s = staffDetail || {};
    return {
      id: s.staffId ?? s.userId ?? s.id,
      name: s.staffName ?? s.fullName ?? s.userName ?? s.name ?? "—",
      phone: s.phone ?? s.phoneNumber ?? "—",
      email: s.email ?? "—",
      address: s.address ?? "—",
      createdAt:
        s.createdAt ?? s.createAt ?? s.created_date
          ? new Date(s.createdAt ?? s.createAt ?? s.created_date).toLocaleDateString("vi-VN")
          : "—",
    };
  }, [staffDetail]);

  const handleDelete = async () => {
    try {
      await deleteStaff(normalized.id);
      toast.success("Xóa nhân viên thành công", { autoClose: 3000 });
      window.location.href = "/dealer-manager/staff";
    } catch (e) {
      toast.error(e?.response?.data?.message || "Xóa nhân viên thất bại", { autoClose: 3000 });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // ===== Dữ liệu mẫu cho Tabs (chưa có API thật) =====
  const workInfoData = [
    { key: "1", date: "2025-01-18", action: "Tạo lead mới", note: "Khách Hà Nội" },
    { key: "2", date: "2025-01-20", action: "Chốt hợp đồng", note: "VF8 bản Plus" },
  ];
  const assignmentsData = [
    { key: "1", id: "VF-1001", model: "VF8", task: "CSKH sau bán", status: "ongoing" },
    { key: "2", id: "VF-1032", model: "VF9", task: "Demo lái thử", status: "done" },
  ];

  const workInfoCols = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Hành động", dataIndex: "action", key: "action" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];
  const assignmentsCols = [
    { title: "Mã xe", dataIndex: "id", key: "id" },
    { title: "Model", dataIndex: "model", key: "model" },
    { title: "Công việc", dataIndex: "task", key: "task" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "done" ? "green" : "blue"}>{s === "done" ? "Hoàn tất" : "Đang thực hiện"}</Tag>,
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <TeamOutlined /> Thông tin công việc
        </span>
      ),
      children: <Table columns={workInfoCols} dataSource={workInfoData} pagination={{ pageSize: 5 }} rowKey="key" />,
    },
    {
      key: "2",
      label: (
        <span>
          <CarOutlined /> Xe phụ trách
        </span>
      ),
      children: (
        <Table columns={assignmentsCols} dataSource={assignmentsData} pagination={{ pageSize: 5 }} rowKey="key" />
      ),
    },
  ];
  // ===================================================

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="staff-detail-container">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/dealer-manager/staff">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết Nhân viên: {normalized.name}
          </Title>
        </div>
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setOpenEdit(true)}>
            Chỉnh sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => setIsDeleteModalOpen(true)}>
            Xóa
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        {/* Thông tin nhân viên */}
        <Col span={8}>
          <Card title="Thông tin Nhân viên" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {normalized.name !== "—" ? normalized.name : "Chưa có thông tin"}
              </Title>
              <Text type="secondary">ID: {normalized.id ?? "N/A"}</Text>
            </div>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                {normalized.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{normalized.email}</Descriptions.Item>
              <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                {normalized.address}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{normalized.createdAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Tabs */}
        <Col span={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          </Card>
        </Col>
      </Row>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa nhân viên"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa nhân viên <strong>{normalized.name}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* TODO: UpdateStaffModal khi backend sẵn sàng */}
    </div>
  );
}
