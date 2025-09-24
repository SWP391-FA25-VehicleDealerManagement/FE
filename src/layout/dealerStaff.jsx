import React from "react";
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
import { useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const menuItems = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  getItem("Vehicle Management", "2", <CarOutlined />),
  getItem("User Management", "sub1", <UserOutlined />, [
    getItem("Customers", "3"),
    getItem("Staff", "4"),
    getItem("Dealers", "5"),
  ]),
  getItem("Reports", "sub2", <TeamOutlined />, [
    getItem("Sales Report", "6"),
    getItem("Inventory Report", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const DealerStaff = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    console.log("Logging out...");
  };

  const handleProfileSettings = () => {
    // Xử lý settings
    console.log("Opening profile settings...");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Settings",
      onClick: handleProfileSettings,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Account Settings",
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
      label: <div className="text-red-500">Logout</div>,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth="0"
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
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white">
          <div className="text-xl font-bold text-blue-600">EVM System</div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="border-0 h-full"
          theme="light"
          style={{
            backgroundColor: "white",
            height: "calc(100vh - 64px)",
          }}
        />
      </Sider>

      <Layout style={{ marginLeft: 250 }}>
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
              Vehicle Management Dashboard
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
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                    className="border-2 border-white"
                  />
                  <span className="text-black font-medium">Admin User</span>
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
             © {new Date().getFullYear()} EVM System. All rights reserved.
            </span>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DealerStaff;
