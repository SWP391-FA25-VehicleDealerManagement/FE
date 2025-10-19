import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Typography,
  Spin,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useVehicleStore from "../../../../hooks/useVehicle";
import useAuthen from "../../../../hooks/useAuthen";
import useDealerRequest from "../../../../hooks/useDealerRequest";

const { Title } = Typography;
const { Option } = Select;

export default function RequestVehicle() {
  const navigate = useNavigate();
  const { vehicles, isLoading, fetchVehicles } = useVehicleStore();
  const { userDetail } = useAuthen();
  const { createRequestVehicle } = useDealerRequest();
  const [searchText, setSearchText] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleViewDetail = (vehicleId) => {
    navigate(`/dealer-manager/vehicle-requests/${vehicleId}`);
  };

  const showOrderModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsOrderModalOpen(true);
  };

  const handleOrderCancel = () => {
    setIsOrderModalOpen(false);
    setSelectedVehicle(null);
    form.resetFields();
  };

  const handleOrderSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Lấy dealerId và userId từ userDetail
      const dealerId = userDetail?.dealer?.dealerId;
      const userId = userDetail?.userId;

      if (!dealerId) {
        toast.error("Không tìm thấy thông tin đại lý", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      if (!userId) {
        toast.error("Không tìm thấy thông tin người dùng", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Lấy variantId từ vehicle (cần có trong vehicle object)
      const variantId = selectedVehicle?.variantId;
      
      if (!variantId) {
        toast.error("Không tìm thấy thông tin phiên bản xe", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Parse price từ string sang number (loại bỏ ký tự không phải số)
      const priceString = selectedVehicle?.price || "0";
      const unitPrice = parseFloat(priceString.replace(/[^0-9.]/g, "")) || 0;

      // Tạo request data theo đúng format API
      const requestData = {
        dealerId: dealerId,
        userId: userId,
        requiredDate: new Date().toISOString(), // Ngày yêu cầu hiện tại
        priority: "NORMAL", // Hoặc lấy từ form nếu có
        notes: values.notes || "",
        requestDetails: [
          {
            variantId: variantId,
            quantity: values.quantity,
            unitPrice: unitPrice,
            notes: values.notes || ""
          }
        ]
      };

      console.log("Request data:", requestData);

      // Gọi API tạo dealer request
      const response = await createRequestVehicle(requestData);

      if (response && response.data) {
        toast.success(
          `Đã gửi yêu cầu đặt ${values.quantity} xe ${selectedVehicle.name} thành công!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          }
        );

        setIsOrderModalOpen(false);
        setSelectedVehicle(null);
        form.resetFields();
      } else {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error("Error ordering vehicle:", error);
      
      // Xử lý error message từ API
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Không thể gửi yêu cầu đặt xe";
      
      toast.error(errorMessage, {
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
      title: "Mã xe",
      dataIndex: "vehicleId",
      key: "vehicleId",
      width: 100,
      sorter: (a, b) => a.vehicleId - b.vehicleId,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image, record) => (
        <img
          src={image || "https://via.placeholder.com/80"}
          alt={record.name}
          style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên xe",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
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
        { text: "Đen", value: "Đen" },
        { text: "Trắng", value: "Trắng" },
        { text: "Đỏ", value: "Đỏ" },
        { text: "Xanh", value: "Xanh" },
        { text: "Bạc", value: "Bạc" },
      ],
      onFilter: (value, record) => record.color === value,
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
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record.vehicleId)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="small"
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
            onClick={() => showOrderModal(record)}
          >
            Đặt xe
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="flex items-center">
          <CarOutlined style={{ marginRight: 8 }} /> Danh sách xe từ hãng
        </Title>
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

      {/* Modal đặt xe */}
      <Modal
        title={`Đặt xe: ${selectedVehicle?.name}`}
        open={isOrderModalOpen}
        onOk={handleOrderSubmit}
        onCancel={handleOrderCancel}
        okText="Đặt xe"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0" },
            ]}
            initialValue={1}
          >
            <InputNumber
              min={1}
              max={selectedVehicle?.stock || 1}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng xe cần đặt"
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea
              rows={4}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded">
            <p className="mb-2">
              <strong>Xe:</strong> {selectedVehicle?.name}
            </p>
            <p className="mb-2">
              <strong>Model:</strong> {selectedVehicle?.modelName}
            </p>
            <p className="mb-2">
              <strong>Phiên bản:</strong> {selectedVehicle?.variantName}
            </p>
            <p className="mb-2">
              <strong>Màu sắc:</strong> {selectedVehicle?.color}
            </p>
            <p className="mb-2">
              <strong>Giá:</strong> {selectedVehicle?.price}
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}