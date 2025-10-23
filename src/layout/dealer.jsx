import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Button, Space } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SettingOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import useAuthen from "../hooks/useAuthen";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children, path) {
  return {
    key,
    icon,
    children,
    label,
    path,
  };
}
const menuItems = [
  getItem(
    "Tổng quan",
    "1",
    <PieChartOutlined />,
    null,
    "/dealer-manager/dashboard"
  ),
  getItem("Quản lý xe", "2", <CarOutlined />, [
    getItem(
      "Danh sách xe",
      "vehicle-list",
      null,
      null,
      "/dealer-manager/vehicles"
    ),
    getItem(
      "Yêu cầu xe từ hãng",
      "vehicle-requests",
      null,
      null,
      "/dealer-manager/vehicle-requests"
    ),
    getItem(
      "Danh mục đơn yêu cầu xe",
      "request-management",
      null,
      null,
      "/dealer-manager/request-list"
    ),
  ]),
  getItem("Quản lý người dùng", "sub1", <UserOutlined />, [
    getItem("Nhân viên", "3", null, null, "/dealer-manager/staff"),
    getItem( "Khách hàng", "customer-list", null, null, "/dealer-manager/customer-list"),
  ]),
  getItem("Báo cáo", "sub2", <TeamOutlined />, [
    getItem(
      "Báo cáo bán hàng",
      "4",
      null,
      null,
      "/dealer-manager/sales-report"
    ),
    getItem("Báo cáo kho", "5", null, null, "/dealer-manager/inventory-report"),
    getItem(
      "Báo cáo công nợ",
      "6",
      null,
      null,
      "/dealer-manager/customer-debt-report"
    ),
  ]),
];

const Dealer = ({ children }) => {
  const [current, setCurrent] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout, userDetail } = useAuthen();

  const storeDefaultSelectedKeys = (keys) => {
    sessionStorage.setItem("selectedMenuKey", keys);
  };

  const resetDefaultSelectedKeys = () => {
    const selectedKeys = sessionStorage.getItem("selectedMenuKey");
    return selectedKeys ? selectedKeys : "dashboard";
  };

  const defaultSelectedKeys = resetDefaultSelectedKeys();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProfileSettings = () => {
    navigate("/dealer-manager/profile");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
      onClick: handleProfileSettings,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: (
        <div className="flex items-center text-red-500">
          <LogoutOutlined />
        </div>
      ),
      label: <div className="text-red-500">Đăng xuất</div>,
      onClick: handleLogout,
    },
  ];

  const renderMenuItems = (items) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => storeDefaultSelectedKeys([item.key])}
          >
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="shadow-lg"
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 100,
        }}
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white">
          <div className="text-xl font-bold text-blue-600">Hệ thống EVM</div>
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={defaultSelectedKeys}
          mode="inline"
          className="border-0 h-full"
          style={{
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        >
          {renderMenuItems(menuItems)}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 0 : 250 }}>
        <Header
          className="sticky top-0 z-50 shadow-md flex items-center justify-between px-6"
          style={{
            background: "white",
            height: "64px",
            padding: "0 24px",
          }}
        >
          <div className="flex items-center">
            <h2 className="text-white text-lg font-semibold m-0">
              Bảng điều khiển quản lý xe
            </h2>
          </div>

          <div className="flex items-center">
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                className="flex items-center text-white hover:bg-white hover:bg-opacity-20 border-0 h-10"
                style={{ padding: "4px 12px" }}
              >
                <Space>
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    className="border-2 border-white"
                  />
                  <span className="text-black font-medium">
                    {userDetail?.userName || "Dealer Manager"}
                  </span>
                  <DownOutlined className="text-black text-xs" />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content
          className="overflow-auto"
          style={{
            minHeight: "calc(100vh - 128px)",
            padding: "24px",
          }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
            {children}
          </div>
        </Content>

        <Footer
          className="text-center border-t border-gray-200"
          style={{
            padding: "16px 24px",
            fontSize: "14px",
            color: "#666",
            backgroundColor: "white",
          }}
        >
          <div className="flex justify-center items-center">
            <span>
              © {new Date().getFullYear()} Hệ thống EVM. Tất cả các quyền được
              bảo lưu.
            </span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dealer;
