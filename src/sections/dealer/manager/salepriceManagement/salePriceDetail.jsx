import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Descriptions,
  Button,
  Typography,
  Spin,
  Space,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Tag,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import useSalePrice from "../../../../hooks/useSalePrice";
import useAuthen from "../../../../hooks/useAuthen";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SalePriceDetail() {
  const { salePriceId } = useParams();
  const navigate = useNavigate();
  const { userDetail } = useAuthen();
  const {
    salePriceDetail,
    isLoading,
    isLoadingUpdate,
    isLoadingDelete,
    fetchSalePriceById,
    updateSalePrice,
    deleteSalePrice,
  } = useSalePrice();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();

  const dealerId = userDetail?.dealer?.dealerId;

  useEffect(() => {
    if (salePriceId) {
      fetchSalePriceById(salePriceId);
    }
  }, [salePriceId]);

  // Format currency
  const formatVnd = (value) => {
    if (!value && value !== 0) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Modal handlers
  const showEditModal = () => {
    form.setFieldsValue({
      price: salePriceDetail?.price,
      effectiveDate: salePriceDetail?.effectiveDate
        ? dayjs(salePriceDetail.effectiveDate)
        : null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();

      const updateData = {
        price: values.price,
        effectiveDate: values.effectiveDate.format("YYYY-MM-DD"),
      };

      const response = await updateSalePrice(salePriceId, updateData);
      if (response && response.status === 200) {
        toast.success("Cập nhật giá bán thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        handleEditCancel();
        fetchSalePriceById(salePriceId);
      }
    } catch (error) {
      console.error("Error updating sale price:", error);
      toast.error(
        error.response?.data?.message || "Cập nhật giá bán thất bại",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  const showDeleteConfirm = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteSalePrice(salePriceId);
      if (response && response.status === 204) {
        toast.success("Xóa giá bán thành công", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/dealer-manager/vehicles/sale-prices");
      }
    } catch (error) {
      console.error("Error deleting sale price:", error);
      toast.error(
        error.response?.data?.message || "Xóa giá bán thất bại",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!salePriceDetail) {
    return (
      <Card>
        <div className="text-center p-10">
          <ExclamationCircleOutlined
            style={{ fontSize: 48, color: "#faad14" }}
          />
          <Title level={4} style={{ marginTop: 16 }}>
            Không tìm thấy giá bán
          </Title>
          <Link to="/dealer-manager/vehicles/sale-prices">
            <Button type="primary" style={{ marginTop: 16 }}>
              <ArrowLeftOutlined /> Quay lại danh sách
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/dealer-manager/vehicles/sale-prices">
          <Button icon={<ArrowLeftOutlined />}>Quay lại danh sách</Button>
        </Link>
      </div>

      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            <DollarOutlined style={{ marginRight: 8 }} />
            Chi tiết giá bán
          </Title>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={showEditModal}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
            >
              Xóa
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID giá bán" span={2}>
            {salePriceDetail.salePriceId}
          </Descriptions.Item>

          <Descriptions.Item label="Phiên bản xe" span={2}>
            <Link
              to={`/dealer-manager/vehicles/variants/${salePriceDetail.variantId}`}
            >
              {salePriceDetail.variantName || "N/A"}
            </Link>
          </Descriptions.Item>

          <Descriptions.Item label="Đại lý" span={2}>
            {salePriceDetail.dealerName || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Giá gốc (MSRP)">
            <Tag color="blue" style={{ fontSize: "16px" }}>
              {formatVnd(salePriceDetail.basePrice)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Giá bán đại lý">
            <Tag color="green" style={{ fontSize: "16px", fontWeight: "bold" }}>
              {formatVnd(salePriceDetail.price)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Chênh lệch">
            {salePriceDetail.price && salePriceDetail.basePrice ? (
              <Tag
                color={
                  salePriceDetail.price - salePriceDetail.basePrice >= 0
                    ? "success"
                    : "error"
                }
                style={{ fontSize: "16px" }}
              >
                {formatVnd(salePriceDetail.price - salePriceDetail.basePrice)}
              </Tag>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Tỷ lệ lợi nhuận">
            {salePriceDetail.price && salePriceDetail.basePrice ? (
              <Tag color="purple" style={{ fontSize: "16px" }}>
                {(
                  ((salePriceDetail.price - salePriceDetail.basePrice) /
                    salePriceDetail.basePrice) *
                  100
                ).toFixed(2)}
                %
              </Tag>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày áp dụng" span={2}>
            {salePriceDetail.effectiveDate ? (
              <Tag color="orange" style={{ fontSize: "14px" }}>
                {dayjs(salePriceDetail.effectiveDate).format("DD/MM/YYYY")}
              </Tag>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa giá bán"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={handleEditCancel}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={isLoadingUpdate}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="price"
            label="Giá bán đại lý"
            rules={[
              { required: true, message: "Vui lòng nhập giá bán" },
              { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá bán"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              step={1000000}
            />
          </Form.Item>

          <Form.Item
            name="effectiveDate"
            label="Ngày áp dụng"
            rules={[{ required: true, message: "Vui lòng chọn ngày áp dụng" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày áp dụng"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa giá bán"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        confirmLoading={isLoadingDelete}
      >
        <p>
          Bạn có chắc chắn muốn xóa giá bán cho{" "}
          <strong>{salePriceDetail?.variantName}</strong> không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
