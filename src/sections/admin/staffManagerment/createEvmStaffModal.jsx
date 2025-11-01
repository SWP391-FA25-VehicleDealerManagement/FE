import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import useEvmStaffStore from "../../../hooks/useEvmStaff";

export default function CreateEvmStaffModal({ isOpen, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { createEvmStaff } = useEvmStaffStore();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        userName: values.userName,
        fullName: values.fullName,
        password: values.password,
        email: values.email,
        phone: values.phone,
        role: values.role || undefined,
      };

      // Gọi đúng 1 API qua store (store sẽ handle toast)
      const created = await createEvmStaff(payload);

      // chỉ xử lý UI (không toast ở đây)
      form.resetFields();
      onClose?.();
      onSuccess?.(created);
    } catch (err) {
      // lỗi đã được toast trong store; nếu cần hiển thị thêm xử lý ở modal thì làm ở đây
      console.error("createEvmStaff failed (modal):", err?.response ?? err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose?.();
  };

  return (
    <Modal
      title="Tạo nhân viên EVM"
      open={!!isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={isLoading}>Hủy</Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={() => form.submit()}>Tạo</Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ role: "EVM_STAFF" }}>
        <Form.Item name="userName" label="Tên đăng nhập" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }, { min: 6 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }, { required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Vai trò">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}