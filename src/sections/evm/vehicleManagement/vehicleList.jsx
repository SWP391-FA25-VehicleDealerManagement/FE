import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Spin,
  Modal,
  Tag,
  Select,
  Form,
  InputNumber,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useVehicleStore from "../../../hooks/useVehicle";
import useModelStore from "../../../hooks/useModel";
import useVariantStore from "../../../hooks/useVariant";

const { Title } = Typography;
const { Option } = Select;

export default function VehicleList() {
  const { vehicles, isLoading, fetchVehicles } = useVehicleStore();
  const { variants, fetchVariants } = useVariantStore();
  const { models, fetchModels } = useModelStore();
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  useEffect(() => {
    fetchVehicles();
    fetchModels();
    fetchVariants();
  }, [fetchVehicles, fetchModels, fetchVariants]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const showDeleteConfirm = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;

    try {
      // TODO: Implement API call to delete vehicle
      // await deleteVehicle(selectedVehicle.vehicleId);

      setIsDeleteModalOpen(false);
      setSelectedVehicle(null);
      fetchVehicles(); // Refresh the list

      toast.success("Xóa phương tiện thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } catch (error) {
      toast.error("Xóa phương tiện thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields();

      // TODO: Implement API call to add vehicle
      // await addVehicle(values);

      setIsAddModalOpen(false);
      form.resetFields();
      fetchVehicles(); // Refresh the list

      toast.success("Thêm phương tiện thành công", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
      });
    } catch (error) {
      toast.error("Thêm phương tiện thất bại", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Mã phương tiện",
      dataIndex: "vehicleId",
      key: "vehicleId",
      ...getColumnSearchProps("vehicleId"),
      sorter: (a, b) => a.vehicleId - b.vehicleId,
    },
    // {
    //   title: "Tên xe",
    //   dataIndex: "name",
    //   key: "name",
    //   ...getColumnSearchProps("name"),
    //   sorter: (a, b) => a.name.localeCompare(b.name),
    // },
    {
      title: "Model",
      dataIndex: "modelName",
      key: "modelName",
      ...getColumnSearchProps("modelName"),
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
    },
    {
      title: "Phiên bản",
      dataIndex: "variantName",
      key: "variantName",
      ...getColumnSearchProps("variantName"),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      filters: [
        { text: "Black", value: "Black" },
        { text: "White", value: "White" },
        { text: "Red", value: "Red" },
        { text: "Green", value: "Green" },
        { text: "Đen", value: "Đen" },
      ],
      onFilter: (value, record) => record.color === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => {
        const priceA = a.price ? parseFloat(a.price.replace(/[^0-9]/g, "")) : 0;
        const priceB = b.price ? parseFloat(b.price.replace(/[^0-9]/g, "")) : 0;
        return priceA - priceB;
      },
      render: (price) => price || "N/A",
    },
    // {
    //   title: "Tồn kho",
    //   dataIndex: "stock",
    //   key: "stock",
    //   sorter: (a, b) => (a.stock || 0) - (b.stock || 0),
    //   render: (stock) => (
    //     <Tag color={stock > 0 ? "green" : "red"}>
    //       {stock !== null ? stock : "N/A"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Đại lý",
    //   dataIndex: "dealerName",
    //   key: "dealerName",
    //   ...getColumnSearchProps("dealerName"),
    //   render: (dealerName) => dealerName || "Chưa phân bổ",
    // },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/evm-staff/vehicles/${record.vehicleId}`}>
            <Button type="primary" icon={<EyeOutlined />} size="small">
              Chi tiết
            </Button>
          </Link>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <CarOutlined style={{ marginRight: 8 }} /> Quản lý phương tiện
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          Thêm phương tiện mới
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={vehicles}
            rowKey="vehicleId"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
          />
        )}
      </Card>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa phương tiện"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Xóa"
        cancelText="Hủy"
        okType="danger"
        closable={false}
      >
        <p>
          Bạn có chắc chắn muốn xóa phương tiện{" "}
          <strong>
            {selectedVehicle?.vehicleId} - {selectedVehicle?.name}
          </strong>{" "}
          không?
        </p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Modal thêm phương tiện mới */}
      <Modal
        title="Thêm phương tiện mới"
        open={isAddModalOpen}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        okText="Thêm"
        cancelText="Hủy"
        closable={false}
        width={800}
      >
        <Form form={form} layout="vertical">
          {/* <Form.Item
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: "Vui lòng nhập tên xe" }]}
          >
            <Input placeholder="Nhập tên xe" />
          </Form.Item> */}

          <Form.Item
            name="vehicleName"
            label="Tên phương tiện"
            rules={[{ required: true, message: "Vui lòng nhập tên phương tiện" }]}
          >
            <Input placeholder="Nhập tên phương tiện" />
          </Form.Item>

          {/* <Form.Item
            name="vehicleType"
            label="Loại xe"
            rules={[{ required: true, message: "Vui lòng nhập loại xe" }]}
          >
            <Input placeholder="Nhập loại xe" />
          </Form.Item> */}

          <Form.Item
            name="variantId"
            label="Phiên bản"
            rules={[{ required: true, message: "Vui lòng chọn phiên bản" }]}
          >
            <Select
              placeholder="Chọn phiên bản"
              loading={!variants.length}
              showSearch
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {variants.map((variant) => (
                <Option key={variant.variantId} value={variant.variantId}>
                  {variant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
          >
           <Input placeholder="Nhập màu sắc xe" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Link ảnh"
            rules={[{ required: true, message: "Vui lòng nhập link ảnh" }]}
          >
            <Input placeholder="Nhập link ảnh xe" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá xe" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Nhập giá xe"
              min={0.1}
              step={0.1}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số lượng"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="dealerId"
            label="Mã đại lý"
            rules={[{ required: true, message: "Vui lòng nhập mã đại lý" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập mã đại lý"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="stockId"
            label="Mã kho"
            rules={[{ required: true, message: "Vui lòng nhập mã kho" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập mã kho"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="vinNumber"
            label="Số VIN"
            rules={[{ required: true, message: "Vui lòng nhập số VIN" }]}
          >
            <Input placeholder="Nhập số VIN" />
          </Form.Item>

          {/* <Form.Item
            name="licensePlate"
            label="Biển số xe"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}
          >
            <Input placeholder="Nhập biển số xe" />
          </Form.Item> */}

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả xe" />
          </Form.Item>

          <Form.Item
            name="manufactureDate"
            label="Ngày sản xuất"
            rules={[{ required: true, message: "Vui lòng nhập ngày sản xuất" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="warrantyExpiryDate"
            label="Ngày hết hạn bảo hành"
            rules={[{ required: true, message: "Vui lòng nhập ngày hết hạn bảo hành" }]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
