import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import useCustomerStore from "../../../../hooks/useCustomer";
import useAuthen from "../../../../hooks/useAuthen";

export default function CreateCustomerModal({ isOpen, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { createCustomer } = useCustomerStore();
  const { userDetail } = useAuthen();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await createCustomer({ ...values, createdBy: userDetail?.userName || "unknown" });
      toast.success("Tạo khách hàng thành công!", { autoClose: 3000 });
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Tạo khách hàng thất bại!", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Tạo khách hàng mới" open={isOpen} onCancel={() => { form.resetFields(); onClose(); }}
           footer={null} width={600} destroyOnClose closable={false}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="customerName" label="Tên khách hàng"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }, { min: 2, message: "Ít nhất 2 ký tự!" }]}>
              <Input placeholder="Nhập tên khách hàng" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập SĐT!" }, { pattern: /^[0-9+\-\s()]+$/, message: "SĐT không hợp lệ!" }]}>
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="address" label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }, { min: 5, message: "Ít nhất 5 ký tự!" }]}>
          <Input placeholder="Nhập địa chỉ" size="large" />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input placeholder="Ghi chú (tuỳ chọn)" size="large" />
        </Form.Item>

        <div className="flex justify-start gap-4 mt-6">
          <Button onClick={() => { form.resetFields(); onClose(); }} size="large">Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">Tạo khách hàng</Button>
        </div>
      </Form>
    </Modal>
  );
}
