import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spin,
  Descriptions,
  Typography,
  Space,
  Tag,
  Image,
  Row,
  Col,
  Divider,
  Avatar,
  Tabs,
  Modal,
  Form,
  InputNumber,
} from "antd";
import {
  ArrowLeftOutlined,
  CarOutlined,
  TagOutlined,
  DollarOutlined,
  ShopOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useVehicleStore from "../../../../hooks/useVehicle";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function DealerVehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchVehicleById, isLoading, updateVehicle } = useVehicleStore();
  const [vehicle, setVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [isUpdatePriceModalOpen, setIsUpdatePriceModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const vehicleData = await fetchVehicleById(id);
        setVehicle(vehicleData);
      }
    };
    loadData();
  }, [id, fetchVehicleById]);

  const showUpdatePriceModal = () => {
    form.setFieldsValue({
      price: vehicle?.price ? parseFloat(vehicle.price.replace(/[^0-9]/g, "")) : 0,
    });
    setIsUpdatePriceModalOpen(true);
  };

  const handleUpdatePriceCancel = () => {
    setIsUpdatePriceModalOpen(false);
    form.resetFields();
  };

  const handleUpdatePriceSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const updateData = {
        price: values.price,
      };

      // TODO: Gọi API cập nhật giá
      console.log("Update price data:", updateData);

      await updateVehicle(id, updateData);

      toast.success("Cập nhật giá bán thành công", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh vehicle data
      const vehicleData = await fetchVehicleById(id);
      setVehicle(vehicleData);

      setIsUpdatePriceModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Cập nhật giá bán thất bại", {
        position: "top-right",
        autoClose: 3000,
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

  if (!isLoading && !vehicle) {
    return (
      <div className="flex justify-center items-center p-20">
        <Card>
          <Title level={3}>Không tìm thấy phương tiện</Title>
          <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại danh sách
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="vehicle-detail-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: 16 }}>
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết phương tiện: {vehicle?.name || vehicle?.modelName}
          </Title>
        </div>
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={showUpdatePriceModal}
        >
          Cập nhật giá bán
        </Button>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Thông tin cơ bản" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              {vehicle?.image || vehicle?.variantImage ? (
                <Image
                  width={200}
                  height={150}
                  src={vehicle?.image || vehicle?.variantImage}
                  alt={vehicle?.name}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                  fallback="data:image/png;base64,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"
                />
              ) : (
                <Avatar size={100} icon={<CarOutlined />} />
              )}
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {vehicle?.name || 'Chưa có thông tin'}
              </Title>
              <Text type="secondary">{vehicle?.modelName || 'N/A'} - {vehicle?.variantName || 'N/A'}</Text>
              <Text type="secondary">ID: {vehicle?.vehicleId || 'N/A'}</Text>
            </div>
            <Divider />
            <Descriptions layout="vertical" column={1}>
              <Descriptions.Item label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><TagOutlined />Màu sắc</span>}>
                {vehicle?.color || 'Chưa có thông tin'}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><DollarOutlined />Giá</span>}>
                <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                  {vehicle?.price || 'Liên hệ'}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShopOutlined />Đại lý</span>}>
                {vehicle?.dealerName || 'Chưa phân bổ'}
              </Descriptions.Item>
              <Descriptions.Item label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><BarcodeOutlined />Số lượng tồn kho</span>}>
                <Tag color={vehicle?.stock > 0 ? "green" : "red"}>
                  {vehicle?.stock !== null ? vehicle?.stock : 'N/A'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={16}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Thông tin chi tiết" key="1">
                {/* Thông tin cơ bản */}
                <Descriptions title="Thông tin cơ bản" bordered column={2} style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Tên xe" span={2}>{vehicle?.name}</Descriptions.Item>
                  <Descriptions.Item label="Model">{vehicle?.modelName}</Descriptions.Item>
                  <Descriptions.Item label="Phiên bản">{vehicle?.variantName}</Descriptions.Item>
                  <Descriptions.Item label="Màu sắc">{vehicle?.color}</Descriptions.Item>
                  <Descriptions.Item label="Giá">{vehicle?.price || 'Liên hệ'}</Descriptions.Item>
                  <Descriptions.Item label="Tồn kho">
                    <Tag color={vehicle?.stock > 0 ? "green" : "red"}>
                      {vehicle?.stock !== null ? vehicle?.stock : 'N/A'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Đại lý">{vehicle?.dealerName || 'Chưa phân bổ'}</Descriptions.Item>
                  <Descriptions.Item label="Mô tả model" span={2}>
                    {vehicle?.modelDescription || 'Chưa có mô tả'}
                  </Descriptions.Item>
                </Descriptions>

                {/* Kích thước & Trọng lượng */}
                {vehicle?.vehicleDetails && (
                  <>
                    <Descriptions title="Kích thước & Trọng lượng" bordered column={2} style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="Kích thước (DxRxC)" span={2}>
                        {vehicle?.vehicleDetails?.dimensionsMm || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Chiều dài cơ sở">
                        {vehicle?.vehicleDetails?.wheelbaseMm ? `${vehicle.vehicleDetails.wheelbaseMm} mm` : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Khoảng sáng gầm">
                        {vehicle?.vehicleDetails?.groundClearanceMm ? `${vehicle.vehicleDetails.groundClearanceMm} mm` : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Trọng lượng">
                        {vehicle?.vehicleDetails?.curbWeightKg ? `${vehicle.vehicleDetails.curbWeightKg} kg` : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số chỗ ngồi">
                        {vehicle?.vehicleDetails?.seatingCapacity || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Dung tích cốp" span={2}>
                        {vehicle?.vehicleDetails?.trunkCapacityLiters ? `${vehicle.vehicleDetails.trunkCapacityLiters} lít` : 'N/A'}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Động cơ & Hiệu suất */}
                    <Descriptions title="Động cơ & Hiệu suất" bordered column={2} style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="Loại động cơ" span={2}>
                        {vehicle?.vehicleDetails?.engineType || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Công suất tối đa">
                        {vehicle?.vehicleDetails?.maxPower || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Mô-men xoắn tối đa">
                        {vehicle?.vehicleDetails?.maxTorque || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tốc độ tối đa">
                        {vehicle?.vehicleDetails?.topSpeedKmh ? `${vehicle.vehicleDetails.topSpeedKmh} km/h` : 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Hệ dẫn động">
                        {vehicle?.vehicleDetails?.drivetrain || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Chế độ lái" span={2}>
                        {vehicle?.vehicleDetails?.driveModes || 'N/A'}
                      </Descriptions.Item>
                      
                      {/* Battery Info - Only show if exists */}
                      {(vehicle?.vehicleDetails?.batteryCapacityKwh || 
                        vehicle?.vehicleDetails?.rangePerChargeKm || 
                        vehicle?.vehicleDetails?.chargingTime) && (
                        <>
                          <Descriptions.Item label="Dung lượng pin">
                            {vehicle?.vehicleDetails?.batteryCapacityKwh ? `${vehicle.vehicleDetails.batteryCapacityKwh} kWh` : 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Phạm vi hoạt động">
                            {vehicle?.vehicleDetails?.rangePerChargeKm ? `${vehicle.vehicleDetails.rangePerChargeKm} km` : 'N/A'}
                          </Descriptions.Item>
                          <Descriptions.Item label="Thời gian sạc" span={2}>
                            {vehicle?.vehicleDetails?.chargingTime || 'N/A'}
                          </Descriptions.Item>
                        </>
                      )}
                    </Descriptions>

                    {/* Ngoại thất & Nội thất */}
                    <Descriptions title="Ngoại thất & Nội thất" bordered column={1} style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="Tính năng ngoại thất">
                        {vehicle?.vehicleDetails?.exteriorFeatures || 'Chưa có thông tin'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Tính năng nội thất">
                        {vehicle?.vehicleDetails?.interiorFeatures || 'Chưa có thông tin'}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* An toàn */}
                    <Descriptions title="Hệ thống an toàn" bordered column={2}>
                      <Descriptions.Item label="Túi khí">
                        {vehicle?.vehicleDetails?.airbags || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Hệ thống phanh">
                        {vehicle?.vehicleDetails?.brakingSystem || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Kiểm soát ổn định (ESC)">
                        <Tag color={vehicle?.vehicleDetails?.hasEsc ? "green" : "red"}>
                          {vehicle?.vehicleDetails?.hasEsc ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          {vehicle?.vehicleDetails?.hasEsc ? ' Có' : ' Không'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Hỗ trợ khởi hành ngang dốc">
                        <Tag color={vehicle?.vehicleDetails?.hasHillStartAssist ? "green" : "red"}>
                          {vehicle?.vehicleDetails?.hasHillStartAssist ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          {vehicle?.vehicleDetails?.hasHillStartAssist ? ' Có' : ' Không'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Cảm biến áp suất lốp">
                        <Tag color={vehicle?.vehicleDetails?.hasTpms ? "green" : "red"}>
                          {vehicle?.vehicleDetails?.hasTpms ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          {vehicle?.vehicleDetails?.hasTpms ? ' Có' : ' Không'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Camera lùi">
                        <Tag color={vehicle?.vehicleDetails?.hasRearCamera ? "green" : "red"}>
                          {vehicle?.vehicleDetails?.hasRearCamera ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          {vehicle?.vehicleDetails?.hasRearCamera ? ' Có' : ' Không'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Khóa cửa trẻ em" span={2}>
                        <Tag color={vehicle?.vehicleDetails?.hasChildLock ? "green" : "red"}>
                          {vehicle?.vehicleDetails?.hasChildLock ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                          {vehicle?.vehicleDetails?.hasChildLock ? ' Có' : ' Không'}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                )}
              </TabPane>
              
              <TabPane tab="Hình ảnh" key="2">
                <Row gutter={[16, 16]}>
                  {vehicle?.image && (
                    <Col span={12}>
                      <Image
                        width="100%"
                        src={vehicle.image}
                        alt={vehicle.name}
                        style={{ borderRadius: 8 }}
                      />
                      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                        Hình ảnh xe
                      </Text>
                    </Col>
                  )}
                  {vehicle?.variantImage && (
                    <Col span={12}>
                      <Image
                        width="100%"
                        src={vehicle.variantImage}
                        alt={vehicle.variantName}
                        style={{ borderRadius: 8 }}
                      />
                      <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 8 }}>
                        Hình ảnh phiên bản
                      </Text>
                    </Col>
                  )}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {/* Modal cập nhật giá */}
      <Modal
        title="Cập nhật giá bán"
        open={isUpdatePriceModalOpen}
        onOk={handleUpdatePriceSubmit}
        onCancel={handleUpdatePriceCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="price"
            label="Giá bán (VNĐ)"
            rules={[
              { required: true, message: "Vui lòng nhập giá bán" },
              { type: "number", min: 0, message: "Giá bán phải lớn hơn 0" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập giá bán"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded">
            <p className="mb-2">
              <strong>Xe:</strong> {vehicle?.name}
            </p>
            <p className="mb-2">
              <strong>Model:</strong> {vehicle?.modelName}
            </p>
            <p className="mb-2">
              <strong>Giá hiện tại:</strong> {vehicle?.price || 'N/A'}
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
