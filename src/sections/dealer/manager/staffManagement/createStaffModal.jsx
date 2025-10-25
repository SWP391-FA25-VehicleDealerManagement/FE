import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import useStaffStore from "../../../../hooks/useDealerStaff";
import useAuthen from "../../../../hooks/useAuthen";

export default function CreateStaffModal({ isOpen, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { createStaff } = useStaffStore();
  const { userDetail } = useAuthen();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const staffData = {
        ...values, // { staffName, phone, address }
        createdBy: userDetail?.userName || "unknown",
      };

      await createStaff(staffData);

      toast.success("Tạo nhân viên thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      form.resetFields();
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating staff:", error);
      toast.error(error?.response?.data?.message || "Tạo nhân viên thất bại!", {
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
      title="Tạo nhân viên mới"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="staffName"
              label="Tên nhân viên"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhân viên!" },
                { min: 2, message: "Tên nhân viên phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên nhân viên" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9+\-\s()]+$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ!" },
                { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập địa chỉ" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-start gap-4 mt-6">
          <Button onClick={handleCancel} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
          >
            Tạo nhân viên
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
