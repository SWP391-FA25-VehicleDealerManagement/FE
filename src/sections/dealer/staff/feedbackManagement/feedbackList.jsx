import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Select,
  Table,
  Input,
  Button,
  Tag,
  Modal,
  Space,
  Empty,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import useFeedback from "../../../../hooks/useFeedback";
import { getFeedbackById } from "../../../../api/feedBack";

const { Title, Text } = Typography;
const { Option } = Select;

const getTypeProps = (type) => {
  const upperType = type?.toUpperCase();
  switch (upperType) {
    case "POSITIVE":
      return { color: "green", text: "Tích cực" };
    case "NEGATIVE":
      return { color: "red", text: "Tiêu cực" };
    case "NEUTRAL":
      return { color: "blue", text: "Trung lập" };
    default:
      return { color: "default", text: type || "Không rõ" };
  }
};

const getStatusProps = (status) => {
  const upperStatus = status?.toUpperCase();
  switch (upperStatus) {
    case "REVIEWED":
      return { color: "geekblue", text: "Đã xem xét" };
    case "PENDING":
      return { color: "gold", text: "Đang chờ" };
    default:
      return { color: "default", text: status || "Không rõ" };
  }
};

export default function DealerStaffFeedbackListPage() {
  const { list = [], isLoading = false, fetchAll, fetchById } = useFeedback();
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // call fetchAll once on mount — keep dependency array size constant
  useEffect(() => {
    (async () => {
      try {
        if (typeof fetchAll === "function") {
          await fetchAll();
        }
      } catch (e) {
        /* ignore */
      }
    })();
    // intentionally empty deps to avoid "changed size" warning
    // fetchAll from hook is expected to be stable; if not, wrap it with useCallback in the hook
  }, []);

  useEffect(() => {
    setData(Array.isArray(list) ? list : []);
  }, [list]);

  const filtered = useMemo(() => {
    return data.filter((it) => {
      const text = (it.content || it.description || "").toLowerCase();
      const meta = (it.customerName || it.email || "").toLowerCase();
      const textMatch =
        !q || text.includes(q.toLowerCase()) || meta.includes(q.toLowerCase());
      const typeMatch =
        !filterType ||
        String(it.feedbackType || "").toUpperCase() === filterType;
      return textMatch && typeMatch;
    });
  }, [data, q, filterType]);

  const openDetail = async (record) => {
    try {
      const id = record.feedbackId ?? record.id;
      let detail = null;

      // prefer store fetchById if it returns the detail object
      if (typeof fetchById === "function") {
        try {
          detail = await fetchById(id);
        } catch (e) {
          // ignore and fallback to direct API call
        }
      }

      if (!detail) {
        const res = await getFeedbackById(id);
        detail = res?.data?.data ?? res?.data ?? null;
      }

      // normalize keys if backend returns array inside data
      if (Array.isArray(detail) && detail.length) detail = detail[0];

      setSelected(detail ?? record);
    } catch (e) {
      console.error("fetch feedback detail failed:", e);
      setSelected(record);
    } finally {
      setIsModalOpen(true);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "feedbackId",
      key: "feedbackId",
      width: 80,
      render: (v, r, i) => v ?? i + 1,
    },
    {
      title: "Loại",
      dataIndex: "feedbackType",
      key: "feedbackType",
      width: 120,
      render: (t) => {
        const { color, text } = getTypeProps(t);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (c, r) =>
        c
          ? String(c).slice(0, 120)
          : r.description
          ? String(r.description).slice(0, 120)
          : "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s) => {
        const { color, text } = getStatusProps(s);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record)}>
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Quản lý Feedback
        </Title>

        <Input
          placeholder="Tìm kiếm nội dung hoặc người phản hồi"
          prefix={<SearchOutlined />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ width: 360 }}
          allowClear
        />

        <Select
          placeholder="Lọc theo loại"
          style={{ width: 160 }}
          allowClear
          value={filterType || undefined}
          onChange={(val) => setFilterType(val || "")}
        >
          <Option value="POSITIVE">POSITIVE</Option>
          <Option value="NEGATIVE">NEGATIVE</Option>
          <Option value="NEUTRAL">NEUTRAL</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey={(r) => r.feedbackId ?? r.id ?? JSON.stringify(r)}
        loading={isLoading}
        locale={{ emptyText: <Empty description="Không có feedback" /> }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chi tiết Feedback"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={720}
      >
        {selected ? (
          <div>
            <Text strong>Người phản hồi: </Text>
            <Text>{selected.customerName || selected.email || "—"}</Text>
            <br />
            <Text strong>Loại: </Text>
            <Tag color={getTypeProps(selected.feedbackType).color}>
              {getTypeProps(selected.feedbackType).text}
            </Tag>
            <br />
            <Text strong>Trạng thái: </Text>
            <Tag color={getStatusProps(selected.status).color}>
              {getStatusProps(selected.status).text}
            </Tag>
            <br />
            <br />
            <Text strong>Mô tả:</Text>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {selected.description || "—"}
            </div>
            <br />
            <Text strong>Nội dung:</Text>
            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
              {selected.content || "—"}
            </div>
            <br />
            <Text type="secondary">
              Ngày:{" "}
              {selected.createdAt
                ? new Date(selected.createdAt).toLocaleString()
                : "—"}
            </Text>
          </div>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>
    </>
  );
}
