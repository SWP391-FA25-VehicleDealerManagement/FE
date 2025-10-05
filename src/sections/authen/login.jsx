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
import { toast } from 'react-toastify';
import logoImage from '../../assets/image/logo/vinfast-logo-mcmp0Am5-removebg-preview.png';
import carImage from '../../assets/image/car/Group14308.png';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, role, isLoading, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && role.toLowerCase()) {
      switch (role.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "evm_staff":
          navigate("/evm-staff/dealer-list");
          break;
        case "dealer_manager":
          navigate("/dealer-manager/dashboard");
          break;
        case "dealer_staff":
          navigate("/dealer-staff/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (values) => {
    try {
      const result = await login(values);
      console.log("Login result:", result);
      
      if (result.success) {
        toast.success("Welcome back to EVM system!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Get the role from the store after successful login
        const currentRole = role;

        // Redirect based on user role
        switch (currentRole) {
          case "ADMIN":
            navigate("/admin/dashboard");
            break;
          case "EVM_STAFF":
            navigate("/evm-staff/dealer-list");
            break;
          case "DEALER_MANAGER":
            navigate("/dealer-manager/dashboard");
            break;
          case "DEALER_STAFF":
            navigate("/dealer-staff/customer-list");
            break;
          default:
            navigate("/");
        }
      } else {
        toast.error("Invalid username or password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response.data.message || "An error occurred during login. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-900 to-blue-700">
      {/* Left side - Car image and logo */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center items-center relative p-8">
        <div className="flex flex-col items-center justify-center h-full">
          <img 
            src={carImage} 
            alt="Vinfast Vehicle" 
            className="max-w-full max-h-[80%] object-contain z-10" 
          />
          <div className="text-white text-center mt-8 z-10">
            <h2 className="text-3xl font-bold mb-2">Electric Vehicle Management System</h2>
            <p className="text-xl opacity-80">Efficient. Sustainable. Connected.</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute h-40 w-40 rounded-full bg-blue-400 top-20 left-20"></div>
          <div className="absolute h-60 w-60 rounded-full bg-blue-300 bottom-20 right-20"></div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
        <Card className="w-full max-w-md rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <img 
              src={logoImage} 
              alt="Vinfast Logo" 
              className="h-12 mx-auto mb-4 lg:hidden" 
            />
            <Title level={2} className="text-blue-800 font-bold">Welcome Back</Title>
            <p className="text-gray-600 mt-2">
              Sign in to access your EVM dashboard
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
                <Input 
                  prefix={<UserOutlined className="text-gray-400" />} 
                  placeholder="Username" 
                  className="rounded-lg py-2" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  className="rounded-lg py-2"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-12 text-base rounded-lg bg-blue-700 hover:bg-blue-800 border-0 font-medium"
                  loading={isLoading}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Spin>
          
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              Need help? Contact your system administrator
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
