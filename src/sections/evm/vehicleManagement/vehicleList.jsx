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
  Image,
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
import axiosClient from "../../../config/axiosClient";

const { Title } = Typography;
const { Option } = Select;

export default function VehicleList() {
  const {
    vehicles,
    isLoading,
    fetchVehicles,
    createNewVehicle,
    deleteVehicleById,
  } = useVehicleStore();
  const { variants, fetchVariants } = useVariantStore();
  const { models, fetchModels } = useModelStore();
  const [searchText, setSearchText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    fetchVehicles();
    fetchModels();
    fetchVariants();
  }, [fetchVehicles, fetchModels, fetchVariants]);

  useEffect(() => {
    const objectUrlsToRevoke = [];

    const fetchAllImages = async () => {
      if (vehicles && vehicles.length > 0) {
        const newImageUrls = {};

        // Tạo mảng các promise để tải ảnh song song
        const fetchPromises = vehicles.map(async (vehicle) => {
          if (vehicle.variantImage) {
            try {
              const response = await axiosClient.get(vehicle.variantImage, {
                responseType: "blob",
              });
              const objectUrl = URL.createObjectURL(response.data);
              objectUrlsToRevoke.push(objectUrl);
              return {
                path: vehicle.variantImage,
                url: objectUrl,
              };
            } catch (error) {
              console.error("Không thể tải ảnh:", vehicle.variantImage, error);
              return {
                path: vehicle.variantImage,
                url: null, // Đánh dấu là lỗi
              };
            }
          }
          return null;
        });

        // Chờ tất cả ảnh được tải về
        const results = await Promise.all(fetchPromises);

        // Cập nhật state
        results.forEach((result) => {
          if (result) {
            newImageUrls[result.path] = result.url;
          }
        });

        setImageUrls(newImageUrls);
      }
    };

    fetchAllImages();

    // Xóa các Object URL khi component unmount
    return () => {
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [vehicles]);

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
    console.log("check id ", selectedVehicle.vehicleId);

    try {
      const response = await deleteVehicleById(selectedVehicle.vehicleId);
      if (response && response.status === 200) {
        setIsDeleteModalOpen(false);
        setSelectedVehicle(null);
        fetchVehicles();

        toast.success("Xóa phương tiện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
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
    setSelectedModelId(null);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("check vaulue", values);

      const response = await createNewVehicle(values);
      if (response && response.status === 200) {
        setIsAddModalOpen(false);
        form.resetFields();
        fetchVehicles();
        toast.success("Thêm phương tiện thành công", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
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
      title: "Mã",
      dataIndex: "vehicleId",
      key: "vehicleId",
      width: "10%",
      ...getColumnSearchProps("vehicleId"),
      sorter: (a, b) => a.vehicleId - b.vehicleId,
    },
    {
      title: "Số VIN",
      dataIndex: "vinNumber",
      key: "vinNumber",
      width: "15%",
      ...getColumnSearchProps("vinNumber"),
    },
    {
      title: "Hình ảnh",
      dataIndex: "variantImage",
      key: "variantImage",
      width: "25%",
      render: (imagePath, record) => {
        const blobUrl = imageUrls[imagePath];
        if (!imagePath) {
          return (
            <div
              style={{
                width: 200,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: 4,
              }}
            >
              <CarOutlined style={{ fontSize: 24, color: "#999" }} />
            </div>
          );
        }

        if (blobUrl) {
          // Trường hợp đã tải xong, dùng blobUrl
          return (
            <Image
              src={blobUrl}
              alt={record.name}
              style={{
                width: 200,
                height: 80,
                objectFit: "cover",
                borderRadius: 4,
              }}
              preview={true}
            />
          );
        }

        // Trường hợp đang tải
        return (
          <div
            style={{
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 4,
            }}
          >
            <Spin size="small" />
          </div>
        );
      },
    },
    {
      title: "Mẫu xe",
      dataIndex: "modelName",
      key: "modelName",
      width: "15%",
      ...getColumnSearchProps("modelName"),
      sorter: (a, b) => a.modelName.localeCompare(b.modelName),
    },
    {
      title: "Phiên bản",
      dataIndex: "variantName",
      key: "variantName",
      width: "15%",
      ...getColumnSearchProps("variantName"),
    },
    {
      title: "Hãng sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
      width: "15%",
      ...getColumnSearchProps("manufacturer"),
    },
    {
      title: "Kiểu dáng",
      dataIndex: "bodyType",
      key: "bodyType",
      width: "10%",
      ...getColumnSearchProps("bodyType"),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: "10%",
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
      dataIndex: "msrp",
      key: "msrp",
      width: "15%",
      sorter: (a, b) => {
        const msrpA = a.msrp ? parseFloat(a.msrp.replace(/[^0-9]/g, "")) : 0;
        const msrpB = b.msrp ? parseFloat(b.msrp.replace(/[^0-9]/g, "")) : 0;
        return msrpA - msrpB;
      },
      render: (msrp) => {
        if (!msrp) {
          return "N/A";
        }
        return msrp.toLocaleString("vi-VN");
      },
    },
    {
      title: "Ngày SX",
      dataIndex: "manufactureDate",
      key: "manufactureDate",
      width: "15%",
      render: (text) =>
        text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
      sorter: (a, b) =>
        new Date(a.manufactureDate) - new Date(b.manufactureDate),
    },
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      width: "10%",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      width: "15%",
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
            scroll={{ x: 2000 }}
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
          {/* === BƯỚC 1: CHỌN MODEL (ĐỂ LỌC) === */}
          <Form.Item
            label="Model"
            // Lưu ý: KHÔNG CÓ 'name' prop, nên sẽ không được submit
            rules={[{ required: true, message: "Vui lòng chọn model" }]}
          >
            <Select
              placeholder="Chọn model xe để lọc phiên bản"
              loading={!models.length}
              showSearch
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => {
                // 1. Cập nhật state để lọc
                setSelectedModelId(value);
                // 2. Xóa lựa chọn "Phiên bản" cũ
                form.setFieldsValue({ variantId: undefined });
              }}
            >
              {models.map((model) => (
                <Option key={model.modelId} value={model.modelId}>
                  {model.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* === BƯỚC 2: CHỌN PHIÊN BẢN (ĐÃ LỌC) === */}
          <Form.Item
            name="variantId"
            label="Phiên bản"
            rules={[{ required: true, message: "Vui lòng chọn phiên bản" }]}
          >
            <Select
              placeholder={
                selectedModelId ? "Chọn phiên bản" : "Vui lòng chọn model trước"
              }
              loading={!variants.length}
              showSearch
              disabled={!selectedModelId} // <-- Bị vô hiệu hóa nếu chưa chọn model
              filterOption={(input, option) =>
                (option?.children ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {/* Lọc danh sách 'variants' dựa trên 'selectedModelId' */}
              {variants
                .filter((variant) => variant.modelId === selectedModelId)
                .map((variant) => (
                  <Option key={variant.variantId} value={variant.variantId}>
                    {variant.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          {/* === BƯỚC 3: CHỌN MÀU SẮC === */}
          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}
          >
            <Input placeholder="Nhập màu sắc xe" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
