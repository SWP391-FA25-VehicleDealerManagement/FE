import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  Divider,
  Spin,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuthen";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, role, isLoading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role) {
      switch (role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "EVM_STAFF":
          navigate("/evm-staff/dashboard");
          break;
        case "DEALER_MANAGER":
          navigate("/dealer-manager/dashboard");
          break;
        case "DEALER_STAFF":
          navigate("/dealer-staff/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (values) => {
    const success = await login(values);

    if (success) {
      // Get the role from the store after successful login
      const currentRole = role;

      // Redirect based on user role
      switch (currentRole) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "EVM_STAFF":
          navigate("/evm-staff/dashboard");
          break;
        case "DEALER_MANAGER":
          navigate("/dealer-manager/dashboard");
          break;
        case "DEALER_STAFF":
          navigate("/dealer-staff/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[400px] rounded-lg shadow-md">
        <div className="text-center mb-6">
          <Title level={2}>Login</Title>
          <p className="text-gray-500 mb-6">
            Welcome back! Please login to your account.
          </p>
        </div>

        <Spin spinning={isLoading}>
          <Form
            name="login-form"
            onFinish={handleLogin}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-10 text-base rounded"
                loading={isLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default Login;
