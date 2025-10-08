import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Descriptions, Button, Tag, Typography, Spin, Avatar, Row, Col, Divider, Space, Modal, Tabs } from "antd";
import { 
  ArrowLeftOutlined, 
  CarOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  CalendarOutlined,
  ShopOutlined,
  BarcodeOutlined,
  TagOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Mock vehicle data
  const mockVehicle = {
    id: "VF1001",
    model: "VF8",
    color: "Đen",
    price: 1200000000,
    year: 2023,
    status: "available",
    dealerId: "DL001",
    dealerName: "Đại lý VinFast Hà Nội",
    manufactureDate: "2023-05-12",
    vin: "WVWZZZ1KZ8M654321",
    engine: "Điện",
    batteryCapacity: "82 kWh",
    range: "400 km",
    power: "300 kW",
    seats: 5,
    warranty: "10 năm/200,000 km",
    features: [
      "Hỗ trợ lái tự động",
      "Cảnh báo điểm mù",
      "Phanh khẩn cấp tự động",
      "Camera 360 độ",
      "Màn hình cảm ứng 15 inch",
      "Sạc không dây"
    ],
    specifications: {
      length: "4750 mm",
      width: "1900 mm",
      height: "1660 mm",
      wheelbase: "2950 mm",
      clearance: "190 mm"
    }
  };

  useEffect(() => {
    // Simulate fetching vehicle data
    setIsLoading(true);
    setTimeout(() => {
      setVehicle(mockVehicle);
      setIsLoading(false);
    }, 1000);
  }, [vehicleId]);

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };
  
  const handleDelete = async () => {
    try {
      // Simulate delete API call
      setIsLoading(true);
      setTimeout(() => {
        toast.success("Xóa phương tiện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        
        // Redirect to vehicle list page
        window.location.href = '/admin/vehicles';
      }, 1000);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Xóa phương tiện thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="vehicle-detail-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/admin/vehicles">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết phương tiện: {vehicle?.model}
          </Title>
        </div>
        <Space>
          <Button type="primary" icon={<EditOutlined />}>
            Chỉnh sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={showDeleteModal}>
            Xóa
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin cơ bản" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              <Avatar size={100} icon={<CarOutlined />} />
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {vehicle?.model || 'Chưa có thông tin'} - {vehicle?.color || 'Chưa có thông tin'}
              </Title>
              <Text type="secondary">ID: {vehicle?.id || 'N/A'}</Text>
            </div>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label={<><BarcodeOutlined /> Mã số VIN</>}>
                {vehicle?.vin || 'Chưa có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label={<><DollarOutlined /> Giá</>}>
                {vehicle?.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vehicle.price) : 'Chưa có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label={<><CalendarOutlined /> Năm sản xuất</>}>
                {vehicle?.year || 'Chưa có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label={<><ShopOutlined /> Đại lý</>}>
                {vehicle?.dealerName || 'Chưa có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label={<><TagOutlined /> Trạng thái</>}>
                <Tag color={vehicle?.status === 'available' ? 'green' : 'blue'}>
                  {vehicle?.status === 'available' ? 'Còn hàng' : 'Đã bán'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab="Thông số kỹ thuật"
                key="1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Descriptions title="Động cơ & Pin" bordered column={1}>
                    <Descriptions.Item label="Loại động cơ">{vehicle?.engine}</Descriptions.Item>
                    <Descriptions.Item label="Dung lượng pin">{vehicle?.batteryCapacity}</Descriptions.Item>
                    <Descriptions.Item label="Phạm vi hoạt động">{vehicle?.range}</Descriptions.Item>
                    <Descriptions.Item label="Công suất">{vehicle?.power}</Descriptions.Item>
                  </Descriptions>
                  
                  <Descriptions title="Kích thước" bordered column={1}>
                    <Descriptions.Item label="Dài">{vehicle?.specifications?.length}</Descriptions.Item>
                    <Descriptions.Item label="Rộng">{vehicle?.specifications?.width}</Descriptions.Item>
                    <Descriptions.Item label="Cao">{vehicle?.specifications?.height}</Descriptions.Item>
                    <Descriptions.Item label="Chiều dài cơ sở">{vehicle?.specifications?.wheelbase}</Descriptions.Item>
                    <Descriptions.Item label="Khoảng sáng gầm xe">{vehicle?.specifications?.clearance}</Descriptions.Item>
                  </Descriptions>
                  
                  <Descriptions title="Thông tin khác" bordered column={1} className="md:col-span-2">
                    <Descriptions.Item label="Số chỗ ngồi">{vehicle?.seats}</Descriptions.Item>
                    <Descriptions.Item label="Bảo hành">{vehicle?.warranty}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sản xuất">
                      {vehicle?.manufactureDate ? new Date(vehicle.manufactureDate).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </TabPane>
              
              <TabPane
                tab="Tính năng"
                key="2"
              >
                <Card title="Danh sách tính năng">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle?.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </TabPane>
              
              <TabPane
                tab="Lịch sử"
                key="3"
              >
                <Card title="Lịch sử phương tiện">
                  <p>Chưa có thông tin lịch sử cho phương tiện này.</p>
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa phương tiện"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa phương tiện{" "}
          <strong>{vehicle?.model} - {vehicle?.id}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
