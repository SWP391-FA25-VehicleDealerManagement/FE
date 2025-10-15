import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Descriptions, Button, Tag, Typography, Spin, Avatar, Row, Col, Divider, Space, Modal, Tabs, Image, Form, Input, InputNumber, Select } from "antd";
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
import useVehicleStore from "../../../hooks/useVehicle";
import useDealerStore from "../../../hooks/useDealer";
import useVariantStore from "../../../hooks/useVariant";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

export default function VehicleDetail() {
  const { vehicleId } = useParams();
  const { vehicles, isLoading, fetchVehicles, updateVehicle } = useVehicleStore();
  const { dealers, fetchDealers } = useDealerStore();
  const { variants, fetchVariants } = useVariantStore();
  const [vehicle, setVehicle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVehicles();
    fetchDealers();
    fetchVariants();
  }, [fetchVehicles, fetchDealers, fetchVariants]);

  useEffect(() => {
    if (vehicles.length > 0 && vehicleId) {
      const foundVehicle = vehicles.find(v => v.vehicleId === parseInt(vehicleId));
      setVehicle(foundVehicle);
    }
  }, [vehicles, vehicleId]);

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const showEditModal = () => {
    form.setFieldsValue({
      name: vehicle?.name,
      color: vehicle?.color,
      image: vehicle?.image,
      price: vehicle?.price,
      stock: vehicle?.stock,
      dealerId: vehicle?.dealerId,
      variantId: vehicle?.variantId,
      vehicleName: vehicle?.vehicleName || vehicle?.name,
      vehicleType: vehicle?.vehicleType || vehicle?.modelName,
      description: vehicle?.description || vehicle?.modelDescription,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Update values:", values);

      const response = await updateVehicle(vehicleId, values);
      
      if (response) {
        toast.success("Cập nhật phương tiện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        
        setIsEditModalOpen(false);
        form.resetFields();
        fetchVehicles();
      }
    } catch (error) {
      console.error("Error updating vehicle:", error);
      toast.error("Cập nhật phương tiện thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      // TODO: Implement API call to delete vehicle
      // await deleteVehicle(vehicleId);
      
      toast.success("Xóa phương tiện thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      
      // Redirect to vehicle list page
      window.location.href = '/admin/vehicles';
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
  console.log("xe", vehicle);
  if (!vehicle) {
    return (
      <div className="flex justify-center items-center p-20">
        <Card>
          <Title level={3}>Không tìm thấy phương tiện</Title>
          <Link to="/admin/vehicles">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại danh sách
            </Button>
          </Link>
        </Card>
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
            Chi tiết phương tiện: {vehicle?.name || vehicle?.modelName}
          </Title>
        </div>
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={showEditModal}>
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
              {vehicle?.image ? (
                <Image
                  width={200}
                  height={150}
                  src={vehicle.image}
                  alt={vehicle.name}
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
                {vehicle?.price || 'Liên hệ'}
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
              <TabPane
                tab="Thông tin chi tiết"
                key="1"
              >
                <Descriptions title="Thông tin phương tiện" bordered column={2}>
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
              </TabPane>
              
              <TabPane
                tab="Hình ảnh"
                key="2"
              >
                <Card title="Hình ảnh phương tiện">
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

      {/* Edit Modal */}
      <Modal
        title={
          <div>
            <EditOutlined style={{ marginRight: 8 }} />
            Chỉnh sửa phương tiện
          </div>
        }
        open={isEditModalOpen}
        onOk={handleUpdateSubmit}
        onCancel={handleEditCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên xe"
                rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
              >
                <Input placeholder="Nhập tên xe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="color"
                label="Màu sắc"
                rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
              >
                <Input placeholder="Nhập màu sắc" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="image"
            label="URL hình ảnh"
            rules={[
              { required: true, message: "Vui lòng nhập URL hình ảnh" },
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập giá"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Tồn kho"
                rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập số lượng"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dealerId"
                label="Đại lý"
                rules={[{ required: true, message: "Vui lòng chọn đại lý" }]}
              >
                <Select placeholder="Chọn đại lý" showSearch optionFilterProp="children">
                  {dealers.map((dealer) => (
                    <Option key={dealer.dealerId} value={dealer.dealerId}>
                      {dealer.dealerName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="variantId"
                label="Phiên bản"
                rules={[{ required: true, message: "Vui lòng chọn phiên bản" }]}
              >
                <Select placeholder="Chọn phiên bản" showSearch optionFilterProp="children">
                  {variants.map((variant) => (
                    <Option key={variant.variantId} value={variant.variantId}>
                      {variant.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="vehicleName"
            label="Tên phương tiện (tùy chọn)"
          >
            <Input placeholder="Nhập tên phương tiện" />
          </Form.Item>

          <Form.Item
            name="vehicleType"
            label="Loại xe (tùy chọn)"
          >
            <Input placeholder="Nhập loại xe" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả phương tiện" />
          </Form.Item>
        </Form>
      </Modal>

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
          <strong>{vehicle?.name} - {vehicle?.vehicleId}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
