import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useEvmStaffStore from "../../../hooks/useEvmStaff";
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
  ProjectOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function EvmStaffDetail() {
  const { staffId } = useParams();
  const { staffDetail, isLoading, fetchEvmStaffById, deleteEvmStaff } = useEvmStaffStore();

  const [activeTab, setActiveTab] = useState("1");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    if (staffId) fetchEvmStaffById(staffId);
  }, [staffId, fetchEvmStaffById]);

  const showDeleteModal = () => setIsDeleteModalOpen(true);
  const handleDeleteCancel = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      await deleteEvmStaff(staffId);
      toast.success("Xóa nhân viên EVM thành công", { position: "top-right", autoClose: 3000 });
      window.location.href = "/admin/staff-management";
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(error?.response?.data?.message || "Xóa nhân viên thất bại", { autoClose: 3000 });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // ----------- MOCK DATA (tạm thời khi chưa có API chi tiết) -------------
  const taskData = [
    { key: "1", id: "T-001", task: "Kiểm tra báo cáo doanh số", status: "done" },
    { key: "2", id: "T-002", task: "Hỗ trợ đại lý miền Bắc", status: "ongoing" },
  ];

  const historyData = [
    { key: "1", date: "2025-01-20", action: "Cập nhật thông tin đại lý A", note: "Hoàn tất đúng hạn" },
    { key: "2", date: "2025-02-10", action: "Thêm nhân viên mới", note: "Đã duyệt" },
  ];

  const taskCols = [
    { title: "Mã công việc", dataIndex: "id", key: "id" },
    { title: "Nội dung", dataIndex: "task", key: "task" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "done" ? "green" : "blue"}>
          {s === "done" ? "Hoàn tất" : "Đang thực hiện"}
        </Tag>
      ),
    },
  ];

  const historyCols = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Hoạt động", dataIndex: "action", key: "action" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
  ];
  // ---------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="evm-staff-detail-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/admin/staff-management">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết nhân viên EVM: {staffDetail?.staffName || "—"}
          </Title>
        </div>
        <Space>
          
          <Button danger icon={<DeleteOutlined />} onClick={showDeleteModal}>
            Xóa
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin Nhân viên" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {staffDetail?.staffName || "Chưa có thông tin"}
              </Title>
              <Text type="secondary">ID: {staffDetail?.staffId ?? "N/A"}</Text>
            </div>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                {staffDetail?.phone || "Chưa có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                {staffDetail?.address || "Chưa có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {staffDetail?.email || "Chưa có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                {staffDetail?.role || "Nhân viên EVM"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {staffDetail?.createdAt
                  ? new Date(staffDetail.createdAt).toLocaleDateString("vi-VN")
                  : "Chưa có thông tin"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <ProjectOutlined />
                    Công việc hiện tại
                  </span>
                }
                key="1"
              >
                <Table
                  columns={taskCols}
                  dataSource={taskData}
                  pagination={{ pageSize: 5 }}
                  rowKey="key"
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <ProjectOutlined />
                    Lịch sử hoạt động
                  </span>
                }
                key="2"
              >
                <Table
                  columns={historyCols}
                  dataSource={historyData}
                  pagination={{ pageSize: 5 }}
                  rowKey="key"
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Xác nhận xóa nhân viên EVM"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa nhân viên{" "}
          <strong>{staffDetail?.staffName}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
