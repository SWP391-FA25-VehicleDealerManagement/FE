import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Table,
  Input,
  Tag,
  Space,
} from "antd";
import {
    CarOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import useReport from "../../../hooks/useReport";

const { Title, Text } = Typography;

const fmt = (n) =>
  Number.isFinite(Number(n)) ? Number(n).toLocaleString("vi-VN") : "0";

export default function InventoryReportPage() {
  const {
    isLoading,
    inventoryReport,
    fetchInventoryReport,
    invTotalVehicles,
    invTotalAvailable,
    invTotalSold,
  } = useReport();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInventoryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!search) return inventoryReport;
    const q = search.toLowerCase();
    return (inventoryReport || []).filter(
      (d) =>
        d?.dealerName?.toLowerCase().includes(q) ||
        d?.address?.toLowerCase().includes(q) ||
        d?.phone?.toLowerCase().includes(q)
    );
  }, [inventoryReport, search]);

  // ---- TỔNG HỢP SỐ LƯỢNG (PHẢI RA SỐ) ----
  const totalVehicles = useMemo(
    () => (typeof invTotalVehicles === "function" ? invTotalVehicles() : 0),
    [inventoryReport, invTotalVehicles]
  );
  const totalAvailable = useMemo(
    () => (typeof invTotalAvailable === "function" ? invTotalAvailable() : 0),
    [inventoryReport, invTotalAvailable]
  );
  const totalSold = useMemo(
    () => (typeof invTotalSold === "function" ? invTotalSold() : 0),
    [inventoryReport, invTotalSold]
  );

  const columns = [
    {
      title: "Mã đại lý",
      dataIndex: "dealerId",
      key: "dealerId",
      width: 110,
      sorter: (a, b) => (a.dealerId || 0) - (b.dealerId || 0),
    },
    {
      title: "Đại lý",
      key: "dealerName",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.dealerName}</div>
          <Text type="secondary">{r.address}</Text>
        </div>
      ),
      sorter: (a, b) => (a.dealerName || "").localeCompare(b.dealerName || ""),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
    },
    {
      title: "Tổng xe",
      dataIndex: "totalVehicles",
      key: "totalVehicles",
      width: 120,
      align: "right",
      sorter: (a, b) => (a.totalVehicles || 0) - (b.totalVehicles || 0),
      render: (v) => <Text strong>{fmt(v)}</Text>,
    },
    {
      title: "Sẵn sàng",
      dataIndex: "availableVehicles",
      key: "availableVehicles",
      width: 130,
      align: "right",
      sorter: (a, b) => (a.availableVehicles || 0) - (b.availableVehicles || 0),
      render: (v) => (
        <Tag color="green" style={{ fontWeight: 600 }}>
          {fmt(v)}
        </Tag>
      ),
    },
    {
      title: "Đã bán",
      dataIndex: "soldVehicles",
      key: "soldVehicles",
      width: 120,
      align: "right",
      sorter: (a, b) => (a.soldVehicles || 0) - (b.soldVehicles || 0),
      render: (v) => (
        <Tag color="volcano" style={{ fontWeight: 600 }}>
          {fmt(v)}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Báo cáo tồn kho
          </Title>
          <Text type="secondary">Tổng hợp theo từng đại lý</Text>
        </div>

        {/* Search ở góc phải cho cân bằng */}
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Tìm đại lý, địa chỉ, số ĐT…"
          style={{ width: 360 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* KPIs */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Tổng số xe"
              value={totalVehicles}
              prefix={<CarOutlined />}
              formatter={(v) => (
                <Text strong style={{ fontSize: 22 }}>
                  {fmt(v)}
                </Text>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Xe sẵn sàng"
              value={totalAvailable}
              prefix={<CheckCircleOutlined />}
              formatter={(v) => (
                <Text strong style={{ fontSize: 22 }}>
                  {fmt(v)}
                </Text>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Xe đã bán"
              value={totalSold}
              prefix={<ShoppingCartOutlined />}
              formatter={(v) => (
                <Text strong style={{ fontSize: 22 }}>
                  {fmt(v)}
                </Text>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={filtered}
          rowKey={(r) => r.dealerId}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t, r) => `${r[0]}-${r[1]} của ${t} mục`,
          }}
        />
      </Card>
    </div>
  );
}
