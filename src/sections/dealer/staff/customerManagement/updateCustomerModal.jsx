import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import useCustomerStore from "../../../../hooks/useCustomer";
import useAuthen from "../../../../hooks/useAuthen";

export default function UpdateCustomerModal({ open, onClose, customer, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { updateCustomer } = useCustomerStore();
  const { userDetail } = useAuthen();

  // Giá trị ban đầu cho form
  const initialValues = useMemo(
    () => ({
      customerName: customer?.customerName || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
    }),
    [customer]
  );

  useEffect(() => {
    if (open) form.setFieldsValue(initialValues);
  }, [open, initialValues, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Lấy dealerId và createBy đúng nguồn
      const dealerId =
        customer?.dealerId ?? userDetail?.dealer?.dealerId ?? null;
      const createBy = userDetail?.userName || customer?.createBy || "system";

      if (!dealerId) {
        toast.error("Không tìm thấy dealerId để cập nhật.", { autoClose: 2500 });
        setLoading(false);
        return;
      }

      // Payload phải khớp schema backend
      const payload = {
        customerId: customer?.customerId,
        dealerId,
        customerName: values.customerName?.trim(),
        email: values.email?.trim() || null,
        phone: values.phone?.trim(),
        createBy,
      };

      await updateCustomer(customer.customerId, payload);
      toast.success("Cập nhật khách hàng thành công!", { autoClose: 2500 });
      onSuccess?.(); // ví dụ: refetch chi tiết
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật khách hàng thất bại!", { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa khách hàng"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={600}
      destroyOnClose
      closable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[
                { required: true, message: "Vui lòng nhập tên!" },
                { min: 2, message: "Ít nhất 2 ký tự!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập SĐT!" },
                { pattern: /^[0-9+\-\s()]+$/, message: "SĐT không hợp lệ!" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email (tuỳ chọn)"
          rules={[{ type: "email", message: "Email không hợp lệ!" }]}
        >
          <Input size="large" />
        </Form.Item>

        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            size="large"
          >
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
