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
import { useNavigate, useLocation } from "react-router-dom";
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
  getItem("Tổng quan", "1", <PieChartOutlined />, null, "/dealer-staff/dashboard"),
  getItem("Quản lý xe", "2", <CarOutlined />, null, "/dealer-staff/vehicle-management"),
  getItem("Quản lý người dùng", "sub1", <UserOutlined />, [
    getItem("Khách hàng", "3", null, null, "/dealer-staff/customers"),
  ]),
  getItem("Báo cáo", "sub2", <TeamOutlined />, [
    getItem("Báo cáo bán hàng", "6", null, null, "/dealer-staff/sales-report"),
    getItem("Báo cáo kho", "8", null, null, "/dealer-staff/inventory-report"),
    getItem("Báo cáo công nợ", "9", null, null, "/dealer-staff/customer-debt-report"),
  ]),
];

const DealerStaff = ({ children }) => {
  const [current, setCurrent] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userDetail } = useAuthen();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleProfileSettings = () => {
    navigate("/dealer-staff/profile");
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

  const handleMenuClick = ({ key }) => {
    const findMenuItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const menuItem = findMenuItem(menuItems, key);
    if (menuItem && menuItem.path) {
      setCurrent(key);
      navigate(menuItem.path);
    }
  };
  
  // Update selected menu item based on current URL path
  useEffect(() => {
    const findMenuKeyByPath = (items, path) => {
      for (const item of items) {
        if (item.path === path) {
          return item.key;
        }
        if (item.children) {
          const found = findMenuKeyByPath(item.children, path);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentPath = location.pathname;
    const menuKey = findMenuKeyByPath(menuItems, currentPath);
    if (menuKey) {
      setCurrent(menuKey);
    }
  }, [location.pathname]);

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
          mode="inline"
          items={menuItems}
          selectedKeys={[current]}
          className="border-0 h-full"
          theme="light"
          onClick={handleMenuClick}
          style={{
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        />
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
                  <span className="text-black font-medium">{ userDetail?.userName || "Dealer Staff"}</span>
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
             © {new Date().getFullYear()} Hệ thống EVM. Tất cả các quyền được bảo lưu.
            </span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DealerStaff;
