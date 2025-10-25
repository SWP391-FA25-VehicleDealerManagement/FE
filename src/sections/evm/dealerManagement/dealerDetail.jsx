import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useDealerStore from "../../../hooks/useDealer";
import { Card, Descriptions, Button, Tabs, Table, Tag, Typography, Spin, Avatar, Row, Col, Divider, Space, Modal } from "antd";
import { 
  ArrowLeftOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  CarOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined
} from "@ant-design/icons";
import UpdateDealerModal from "./updateDealerModal";
import CreateDealerManagerModal from "./createDealerManagerModal";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function DealerDetail() {
  const { dealerId } = useParams();
  const { dealerDetail, isLoading, fetchDealerById, deleteDealer } = useDealerStore();
  const [activeTab, setActiveTab] = useState("1");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [createManagerModalVisible, setCreateManagerModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (dealerId) {
        await fetchDealerById(dealerId);
      }
    };
    fetchData();
  }, [dealerId, fetchDealerById]);
  
  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleDelete = async () => {
    try {
      await deleteDealer(dealerId);
      toast.success("Xóa đại lý thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      window.location.href = '/evm-staff/dealer-list'; // Redirect to dealer list
    } catch (error) {
      console.error("Error deleting dealer:", error);
      toast.error(error.response?.data?.message || "Xóa đại lý thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Placeholder data for staff members
  const staffData = [
    {
      key: '1',
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Quản lý',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      status: 'active',
    },
    {
      key: '2',
      id: 2,
      name: 'Trần Thị B',
      role: 'Nhân viên bán hàng',
      email: 'tranthib@example.com',
      phone: '0909876543',
      status: 'active',
    },
  ];

  // Placeholder data for vehicles
  const vehicleData = [
    {
      key: '1',
      id: 'VF1001',
      model: 'VF8',
      color: 'Đen',
      price: 1200000000,
      status: 'available',
    },
    {
      key: '2',
      id: 'VF1002',
      model: 'VF9',
      color: 'Trắng',
      price: 1500000000,
      status: 'sold',
    },
  ];

  // Staff table columns
  const staffColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
  ];

  // Vehicle table columns
  const vehicleColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'blue'}>
          {status === 'available' ? 'Còn hàng' : 'Đã bán'}
        </Tag>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dealer-detail-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/evm-staff/dealer-list">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết Đại lý: {dealerDetail.dealerName}
          </Title>
        </div>
        <Space>
          <Button 
            type="default" 
            icon={<UserAddOutlined />} 
            onClick={() => setCreateManagerModalVisible(true)}
          >
            Tạo tài khoản quản lý
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => setUpdateModalVisible(true)}
          >
            Chỉnh sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={showDeleteModal}
          >
            Xóa
          </Button>
        </Space>
      </div>
      
      {/* Update Dealer Modal */}
      <UpdateDealerModal
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        dealer={dealerDetail}
      />

      {/* Create Dealer Manager Modal */}
      <CreateDealerManagerModal
        isOpen={createManagerModalVisible}
        onClose={() => setCreateManagerModalVisible(false)}
        dealerId={dealerDetail.dealerId}
        dealerName={dealerDetail.dealerName}
      />

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin Đại lý" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {dealerDetail.dealerName || 'Chưa có thông tin'}
              </Title>
              <Text type="secondary">ID: {dealerDetail.dealerId || 'N/A'}</Text>
            </div>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                {dealerDetail.phone || 'Chưa có thông tin'}
              </Descriptions.Item>
              {/* <Descriptions.Item label={<><MailOutlined /> Email</>}>
                {dealerDetail.email || 'Chưa có thông tin'}
              </Descriptions.Item> */}
              <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                {dealerDetail.address || 'Chưa có thông tin'}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Trạng thái">
                <Tag color={dealerDetail.status === 'active' ? 'green' : 'red'}>
                  {dealerDetail.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item> */}
              <Descriptions.Item label="Ngày thành lập">
                {dealerDetail.createdAt ? new Date(dealerDetail.createdAt).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
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
                    <TeamOutlined />
                    Danh sách Nhân viên
                  </span>
                }
                key="1"
              >
                <Table
                  columns={staffColumns}
                  dataSource={staffData}
                  pagination={{ pageSize: 5 }}
                  rowKey="id"
                />
              </TabPane>
              {/* <TabPane
                tab={
                  <span>
                    <CarOutlined />
                    Danh sách Xe
                  </span>
                }
                key="2"
              >
                <Table
                  columns={vehicleColumns}
                  dataSource={vehicleData}
                  pagination={{ pageSize: 5 }}
                  rowKey="id"
                />
              </TabPane> */}
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa đại lý"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa đại lý{" "}
          <strong>{dealerDetail?.dealerName}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
