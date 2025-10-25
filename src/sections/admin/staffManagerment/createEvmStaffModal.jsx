import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import useEvmStaffStore from "../../../hooks/useEvmStaff";

export default function CreateEvmStaffModal({ isOpen, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { createEvmStaff } = useEvmStaffStore();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await createEvmStaff(values);
      toast.success("Tạo nhân viên EVM thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating EVM staff:", error);
      toast.error("Tạo nhân viên EVM thất bại!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm nhân viên EVM mới"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      closable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="staffName"
              label="Tên nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
            >
              <Input placeholder="Nhập tên nhân viên" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Nhập email" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Chức vụ"
              rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
            >
              <Input placeholder="Nhập chức vụ" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={handleCancel} size="large">
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">
            Tạo nhân viên
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
