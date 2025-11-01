import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Typography,
  Tag,
  Space,
  Button,
  Input,
  Segmented,
  Modal,
  Descriptions,
  Spin,
} from "antd";
import {
  PercentageOutlined,
  ReloadOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axiosClient from "../../../config/axiosClient"; // ⚠️ chỉnh path đúng với dự án của bạn

const { Title, Text } = Typography;

// Giúp đọc data từ API linh hoạt với 2 format: {data: [...]} hoặc [...]
const pickArray = (res) => res?.data?.data ?? res?.data ?? [];

function statusOf(promo) {
  const now = dayjs();
  const start = promo?.startDate ? dayjs(promo.startDate) : null;
  const end = promo?.endDate ? dayjs(promo.endDate) : null;

  if (!start || !end) return "UNKNOWN";

  if (now.isBefore(start)) return "UPCOMING";
  if (now.isAfter(end)) return "ENDED";
  return "ACTIVE"; // now in [start, end]
}

function statusTag(promo) {
  const s = statusOf(promo);
  const activeFlag = promo?.active;

  // Nếu backend có cờ active, ưu tiên hiển thị Inactive khi out-of-service
  if (s === "ACTIVE") {
    return activeFlag ? <Tag color="green">Đang hiệu lực</Tag> : <Tag color="default">Tạm ngưng</Tag>;
  }
  if (s === "UPCOMING") return <Tag color="blue">Sắp diễn ra</Tag>;
  if (s === "ENDED") return <Tag color="red">Đã kết thúc</Tag>;
  return <Tag>—</Tag>;
}

export default function PromotionListPage() {
  const [loading, setLoading] = useState(false);
  const [promos, setPromos] = useState([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("ALL");
  const [detail, setDetail] = useState(null); // dữ liệu đang xem chi tiết

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      // Thay endpoint nếu swagger của bạn khác (ví dụ: /api/promotions)
      const res = await axiosClient.get("/api/promotions");
      setPromos(Array.isArray(pickArray(res)) ? pickArray(res) : []);
    } catch (e) {
      console.error("load promotions error:", e);
      setPromos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return promos
      .filter((p) => {
        if (!q) return true;
        const hay =
          `${p?.title ?? ""} ${p?.description ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .filter((p) => {
        if (view === "ALL") return true;
        const s = statusOf(p);
        if (view === "ACTIVE") return s === "ACTIVE" && !!p?.active;
        if (view === "UPCOMING") return s === "UPCOMING";
        if (view === "ENDED") return s === "ENDED";
        return true;
      });
  }, [promos, query, view]);

  const columns = [
    {
      title: "ID",
      dataIndex: "promoId",
      key: "promoId",
      width: 90,
      sorter: (a, b) => (a.promoId ?? 0) - (b.promoId ?? 0),
    },
    {
      title: "Tiêu đề",
      key: "title",
      render: (_, r) => (
        <Space>
          <PercentageOutlined />
          <Text strong>{r?.title ?? "—"}</Text>
        </Space>
      ),
      sorter: (a, b) => (a?.title ?? "").localeCompare(b?.title ?? ""),
    },
    {
      title: "Giảm (%)",
      dataIndex: "discountRate",
      key: "discountRate",
      align: "right",
      width: 110,
      sorter: (a, b) => (a?.discountRate ?? 0) - (b?.discountRate ?? 0),
      render: (v) => <Text>{v ?? 0}%</Text>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
      sorter: (a, b) =>
        dayjs(a?.startDate ?? 0).valueOf() - dayjs(b?.startDate ?? 0).valueOf(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD/MM/YYYY") : "—"),
      sorter: (a, b) =>
        dayjs(a?.endDate ?? 0).valueOf() - dayjs(b?.endDate ?? 0).valueOf(),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      render: (_, r) => statusTag(r),
      filters: [
        { text: "Đang hiệu lực", value: "ACTIVE" },
        { text: "Sắp diễn ra", value: "UPCOMING" },
        { text: "Đã kết thúc", value: "ENDED" },
      ],
      onFilter: (val, record) => statusOf(record) === val,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 110,
      render: (_, r) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => setDetail(r)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>
          Danh sách Khuyến mãi
        </Title>
        <Space.Compact>
          <Input
            allowClear
            placeholder="Tìm theo tiêu đề/mô tả…"
            prefix={<SearchOutlined />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 280 }}
          />
          <Segmented
            value={view}
            onChange={(v) => setView(v)}
            options={[
              { label: "Tất cả", value: "ALL" },
              { label: "Hiệu lực", value: "ACTIVE" },
              { label: "Sắp diễn ra", value: "UPCOMING" },
              { label: "Đã kết thúc", value: "ENDED" },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchPromotions}>
            Tải lại
          </Button>
        </Space.Compact>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center p-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey={(r) => r?.promoId ?? r?.id}
            columns={columns}
            dataSource={filtered}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (t, r) => `${r[0]}-${r[1]} của ${t} mục`,
            }}
          />
        )}
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết khuyến mãi"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        width={720}
      >
        {detail ? (
          <Descriptions layout="vertical" column={2} colon={false}>
            <Descriptions.Item label="ID">
              <Text code>{detail?.promoId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {statusTag(detail)}
            </Descriptions.Item>

            <Descriptions.Item label="Tiêu đề" span={2}>
              <Text strong>{detail?.title ?? "—"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Mô tả" span={2}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {detail?.description || "—"}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="Giảm giá">
              <Text>{detail?.discountRate ?? 0}%</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Kích hoạt">
              {detail?.active ? <Tag color="green">Đang bật</Tag> : <Tag>Đang tắt</Tag>}
            </Descriptions.Item>

            <Descriptions.Item label="Bắt đầu">
              {detail?.startDate ? dayjs(detail.startDate).format("DD/MM/YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Kết thúc">
              {detail?.endDate ? dayjs(detail.endDate).format("DD/MM/YYYY") : "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </div>
  );
}
