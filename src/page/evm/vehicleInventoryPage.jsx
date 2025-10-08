import React, { useState } from "react";
import {
  Tabs,
  Card,
  Typography,
} from "antd";
import { DatabaseOutlined, SwapOutlined } from "@ant-design/icons";
import InventoryManagement from "../../sections/evm/vehicleManagement/inventoryManagement";
import VehicleAllocation from "../../sections/evm/vehicleManagement/vehicleAllocation";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function VehicleInventoryPage() {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Quản lý kho và phân bổ xe</Title>
      
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <DatabaseOutlined /> Quản lý kho xe
              </span>
            }
            key="1"
          >
            <InventoryManagement />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SwapOutlined /> Phân bổ xe cho đại lý
              </span>
            }
            key="2"
          >
            <VehicleAllocation />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}