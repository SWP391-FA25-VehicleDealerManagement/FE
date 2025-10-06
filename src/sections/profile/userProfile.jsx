import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Form, Input, Row, Col, Tabs, Typography, Tag, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, BankOutlined, LockOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('userDetail')) || {};
    console.log("User Data:", user);
    setUserData(user);
    setLoading(false);
    
    // Set form initial values
    form.setFieldsValue({
      username: user.userName || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, [form]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSave = (values) => {
    // Update local storage
    const updatedUser = { ...userData, ...values };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setEditMode(false);
    message.success('Cập nhật hồ sơ thành công');
  };

  const handlePasswordChange = (values) => {
    // In a real app, this would call an API
    message.success('Thay đổi mật khẩu thành công');
  };

  // Định nghĩa map ở phạm vi component để có thể sử dụng ở nhiều nơi
  const roleColorMap = {
    admin: 'purple',
    'dealer_manager': 'blue',
    'dealer_staff': 'cyan',
    'evm_staff': 'green',
  };

  const roleLabelMap = {
    admin: 'Quản trị viên',
    'dealer_manager': 'Quản lý Đại lý',
    'dealer_staff': 'Nhân viên Đại lý',
    'evm_staff': 'Nhân viên EVM',
  };

  const getUserRoleBadge = () => {
    if (!userData || !userData.role) return null;

    const roleLowerCase = userData.role.toLowerCase();
    
    return (
      <Tag color={roleColorMap[roleLowerCase] || 'default'}>
        {roleLabelMap[roleLowerCase] || userData.role}
      </Tag>
    );
  };

  return (
    <div className="fade-in">
      <Card loading={loading} bordered={false} className="shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-4 md:mb-0 md:mr-8 text-center">
            <Avatar size={120} icon={<UserOutlined />} src={userData?.avatar} className="border-2 border-blue-200" />
            <div className="mt-4">
              {getUserRoleBadge()}
            </div>
            {!editMode && (
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={toggleEditMode}
                className="mt-4"
              >
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>

          <div className="flex-1">
            {editMode ? (
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="username"
                      rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                </Row>
                <div className="flex justify-end mt-4">
                  <Button className="mr-2" onClick={() => setEditMode(false)}>
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <Title level={3}>
                  {userData?.userName || 'User Name'}
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Text type="secondary">
                      <MailOutlined className="mr-2" />
                      Email
                    </Text>
                    <div>{userData?.email || 'N/A'}</div>
                  </div>
                  <div>
                    <Text type="secondary">
                      <PhoneOutlined className="mr-2" />
                      Số điện thoại
                    </Text>
                    <div>{userData?.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <Text type="secondary">
                      <IdcardOutlined className="mr-2" />
                      Chức vụ
                    </Text>
                    <div>{userData?.role ? roleLabelMap[userData.role.toLowerCase()] || userData.role : 'N/A'}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <Divider />

        <Tabs defaultActiveKey="security">
          <TabPane tab="Bảo mật" key="security">
            <Card title="Thay đổi mật khẩu" bordered={false}>
              <Form layout="vertical" onFinish={handlePasswordChange}>
                <Form.Item
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Hai mật khẩu không khớp nhau'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật mật khẩu
                </Button>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserProfile;
