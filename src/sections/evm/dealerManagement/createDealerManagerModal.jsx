import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";
import { toast } from "react-toastify";
import { createDealerManagerAccount } from "../../../api/dealer";

export default function CreateDealerManagerModal({
  isOpen,
  onClose,
  dealerId,
  dealerName,
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const managerData = {
        ...values,
        dealerId: dealerId,
      };
      console.log("Manager Data:", managerData);

      await createDealerManagerAccount(managerData);

      toast.success("Tạo tài khoản quản lý đại lý thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error creating dealer manager account:", error);
      toast.error(
        error.response?.data?.message ||
          "Tạo tài khoản quản lý đại lý thất bại!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        }
      );
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
      title={`Tạo tài khoản quản lý cho ${dealerName}`}
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
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên đăng nhập" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" size="large" />
        </Form.Item>

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
            Tạo tài khoản
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
