import React from "react";
import { Layout, Menu, Dropdown, Avatar, Button, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  ShopOutlined,
  CarOutlined,
  TagOutlined,
  StockOutlined,
  FileTextOutlined,
  DollarOutlined,
  ContactsOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, path) {
  return { key, icon, children, label, path };
}

const adminMenuItems = [
  getItem("Dashboard", "dashboard", <DashboardOutlined />, null, "/evm-staff/dashboard"),
  getItem("Product Management", "1", <CarOutlined />, [
    getItem("Vehicle-catalog", "2", <CarOutlined />, null, "/evm-staff/vehicle-catalog"),
    getItem("Inventory Management", "3", <StockOutlined />, null, "/evm-staff/inventory-management"),
    getItem("Vehicle Allocation", "4", <ShopOutlined />, null, "/evm-staff/vehicle-allocation"),
  ]),
  getItem("Promotion Management", "5", <TagOutlined />, [
    getItem("Promotion List", "6", <ContactsOutlined />, null, "/evm-staff/promotion-list"),
    getItem("Promotion For Dealer", "7", <FileTextOutlined />, null, "/evm-staff/promotion-dealer"),
  ]),
  getItem("Dealer Management", "8", <ShopOutlined />, [
    getItem("Dealer List", "9", <ContactsOutlined />, null, "/evm-staff/dealer-list"),
    getItem("Contracts & Targets", "10", <FileTextOutlined />, null, "/evm-staff/contracts-targets"),
    getItem("Debts", "11", <DollarOutlined />, null, "/evm-staff/debts"),
  ]),
];

const EvmStaff = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const user = {
    name: "Admin User",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
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

    const menuItem = findMenuItem(adminMenuItems, key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    }
  };

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
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white">
          <div className="text-xl font-bold text-blue-600">EVM System</div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={adminMenuItems}
          className="border-0 h-full"
          theme="light"
          onClick={handleMenuClick}
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
          <div className="flex items-center"></div>

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
                    src={user?.avatar}
                    className="border-2 border-white"
                  />
                  <span className="text-black font-medium">{user?.name}</span>
                  <DownOutlined className="text-black text-xs" />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ minHeight: "calc(100vh - 128px)", padding: "24px" }}>
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

export default EvmStaff;
