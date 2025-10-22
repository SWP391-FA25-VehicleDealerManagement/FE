import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Typography,
  Spin,
  Row,
  Col,
  Divider,
  Space,
  Modal,
  Image,
  Tag,
  Form,
  Input,
  Select,
} from "antd";
import {
  ArrowLeftOutlined,
  CarOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useVariantStore from "../../../hooks/useVariant";

const { Title, Text } = Typography;
const { Option } = Select;

export default function VariantDetail() {
  const { variantId } = useParams();
  const navigate = useNavigate();
  const { variants, isLoading, fetchVariants, deleteVariant, updateVariant } = useVariantStore();
  const [variant, setVariant] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (variants.length === 0) {
      fetchVariants();
    }
  }, [variants.length, fetchVariants]);

  useEffect(() => {
    if (variants.length > 0 && variantId) {
      const foundVariant = variants.find(
        (v) => v.variantId === parseInt(variantId)
      );
      setVariant(foundVariant);
    }
  }, [variants, variantId]);

  const showDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const showEditModal = () => {
    form.setFieldsValue({
      name: variant?.name,
      modelId: variant?.modelId,
      image: variant?.image,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setIsUpdating(true);

      const data = {
        name: values.name,
        modelId: values.modelId,
        image: values.image,
      };

      const response = await updateVariant(variantId, data);

      if (response.data.success) {
        toast.success("Cập nhật phiên bản thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
        setIsEditModalOpen(false);
        form.resetFields();
        // Refresh data
        await fetchVariants();
      } else {
        toast.error(response.data.message || "Cập nhật phiên bản thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating variant:", error);
      toast.error(error.response?.data?.message || "Cập nhật phiên bản thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!variantId) return;

    setIsDeleting(true);
    try {
      const response = await deleteVariant(variantId);
      
      if (response.data.success) {
        toast.success("Xóa phiên bản thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });

        // Redirect to variant list page
        setTimeout(() => {
          navigate("/evm-staff/vehicle-types");
        }, 1000);
      } else {
        toast.error(response.data.message || "Xóa phiên bản thất bại", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error(error.response?.data?.message || "Xóa phiên bản thất bại", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      setIsDeleting(false);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="flex justify-center items-center p-20">
        <Card>
          <Title level={3}>Không tìm thấy phiên bản</Title>
          <Link to="/evm-staff/vehicle-types">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại danh sách
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="variant-detail-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/evm-staff/vehicle-types">
            <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
              Quay lại
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết phiên bản: {variant?.name}
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
          <Card title="Hình ảnh phiên bản" bordered={false}>
            <div className="flex flex-col items-center mb-6">
              {variant?.defaultImageUrl ? (
                <Image
                  width={250}
                  height={200}
                  src={variant.defaultImageUrl}
                  alt={variant.name}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                  fallback="data:image/png;base64,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"
                />
              ) : (
                <div
                  style={{
                    width: 250,
                    height: 200,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                  }}
                >
                  <CarOutlined style={{ fontSize: 60, color: "#999" }} />
                </div>
              )}
              <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                {variant?.name}
              </Title>
              <Text type="secondary">{variant?.modelName}</Text>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Thông tin phiên bản">
            <Descriptions bordered column={2}>
              <Descriptions.Item
                label={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <TagOutlined />
                    ID Phiên bản
                  </span>
                }
              >
                <Tag color="blue">{variant?.variantId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <TagOutlined />
                    ID Model
                  </span>
                }
              >
                <Tag color="green">{variant?.modelId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tên phiên bản" span={2}>
                {variant?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Model xe" span={2}>
                {variant?.modelName}
              </Descriptions.Item>
              <Descriptions.Item label="Đường link hình ảnh" span={2}>
                {variant?.image || "Chưa có hình ảnh"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="mt-4">
              <Title level={4}>Thông tin bổ sung</Title>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Ngày tạo">
                  Chưa có thông tin
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                  Chưa có thông tin
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa phiên bản"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
        confirmLoading={isDeleting}
      >
        <p>
          Bạn có chắc chắn muốn xóa phiên bản{" "}
          <strong>
            {variant?.name} - {variant?.variantId}
          </strong>{" "}
          không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa phiên bản"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={handleEditCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        closable={false}
        confirmLoading={isUpdating}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phiên bản"
            rules={[
              { required: true, message: "Vui lòng nhập tên phiên bản" },
            ]}
          >
            <Input placeholder="Ví dụ: Vios G 1.5" />
          </Form.Item>

          <Form.Item
            name="modelId"
            label="Model"
            rules={[{ required: true, message: "Vui lòng chọn model" }]}
          >
            <Select placeholder="Chọn model xe">
              <Option value={1}>Toyota Vios</Option>
              <Option value={2}>Ford Ranger</Option>
              <Option value={3}>Hyundai Accent</Option>
              <Option value={4}>VinFast Lux A2.0</Option>
              <Option value={5}>Honda City</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="URL Hình ảnh"
            rules={[
              { required: true, message: "Vui lòng nhập URL hình ảnh" },
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
