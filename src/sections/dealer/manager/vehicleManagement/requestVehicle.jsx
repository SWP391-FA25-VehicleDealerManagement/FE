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
  DatePicker,
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
import dayjs from "dayjs";

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
  const [totalAmount, setTotalAmount] = useState(0);
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
    // Tính tổng tiền ban đầu với số lượng = 1
    const priceString = vehicle?.listingPrice || "0";
    const unitPrice = parseFloat(priceString.replace(/[^0-9]/g, "")) || 0;
    setTotalAmount(unitPrice);
  };

  const handleOrderCancel = () => {
    setIsOrderModalOpen(false);
    setSelectedVehicle(null);
    setTotalAmount(0);
    form.resetFields();
  };

  const handleQuantityChange = (value) => {
    if (selectedVehicle && value) {
      const priceString = selectedVehicle?.listingPrice || "0";
      const unitPrice = parseFloat(priceString.replace(/[^0-9]/g, "")) || 0;
      setTotalAmount(unitPrice * value);
    } else {
      setTotalAmount(0);
    }
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
      const priceString = selectedVehicle?.listingPrice || "0";
      const unitPrice = parseFloat(priceString.replace(/[^0-9.]/g, "")) || 0;

      // Tạo request data theo đúng format API
      const requestData = {
        dealerId: dealerId,
        userId: userId,
        requiredDate: values.requiredDate ? values.requiredDate.toISOString() : new Date().toISOString(),
        priority: values.priority || "NORMAL",
        notes: values.notes || "",
        requestDetails: [
          {
            variantId: variantId,
            color: values.color || selectedVehicle?.color,
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
      fixed: "left",
      sorter: (a, b) => a.vehicleId - b.vehicleId,
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (imageUrl, record) => (
        <img
          src={imageUrl || "https://via.placeholder.com/80"}
          alt={record.variantName}
          style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên xe",
      dataIndex: "modelName",
      key: "modelName",
      width: 150,
      ...getColumnSearchProps("modelName"),
      sorter: (a, b) => (a.modelName || "").localeCompare(b.modelName || ""),
    },
    {
      title: "Phiên bản",
      dataIndex: "variantName",
      key: "variantName",
      width: 150,
      ...getColumnSearchProps("variantName"),
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      width: 120,
      filters: [
        { text: "Đen", value: "Đen" },
        { text: "Trắng", value: "Trắng" },
        { text: "Đỏ", value: "Đỏ" },
        { text: "Xanh", value: "Xanh" },
        { text: "Bạc", value: "Bạc" },
        { text: "Green", value: "Green" },
        { text: "Black", value: "Black" },
        { text: "White", value: "White" },
      ],
      onFilter: (value, record) => record.color === value,
    },
    {
      title: "VIN Number",
      dataIndex: "vinNumber",
      key: "vinNumber",
      width: 180,
      ...getColumnSearchProps("vinNumber"),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "listingPrice",
      key: "listingPrice",
      width: 150,
      sorter: (a, b) => {
        const priceA = a.listingPrice ? parseFloat(a.listingPrice.replace(/[^0-9]/g, "")) : 0;
        const priceB = b.listingPrice ? parseFloat(b.listingPrice.replace(/[^0-9]/g, "")) : 0;
        return priceA - priceB;
      },
      render: (listingPrice) => listingPrice || "N/A",
    },
    {
      title: "Bảo hành đến",
      dataIndex: "warrantyExpiryDate",
      key: "warrantyExpiryDate",
      width: 150,
      sorter: (a, b) => new Date(a.warrantyExpiryDate) - new Date(b.warrantyExpiryDate),
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : "N/A",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 220,
      fixed: "right",
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
            scroll={{ x: 1400 }}
          />
        )}
      </Card>

      {/* Modal đặt xe */}
      <Modal
        title={`Đặt xe: ${selectedVehicle?.modelName} ${selectedVehicle?.variantName}`}
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
              max={selectedVehicle?.stock || 100}
              style={{ width: "100%" }}
              placeholder="Nhập số lượng xe cần đặt"
              onChange={handleQuantityChange}
            />
          </Form.Item>

          <div className="bg-blue-50 p-4 rounded mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">
                <strong>Đơn giá:</strong>
              </span>
              <span className="text-lg text-blue-600">
                {selectedVehicle?.listingPrice || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg">
                <strong>Số lượng:</strong>
              </span>
              <span className="text-lg font-bold">
                {form.getFieldValue('quantity') || 1} xe
              </span>
            </div>
            <div className="border-t border-blue-200 mt-3 pt-3 flex justify-between items-center">
              <span className="text-xl">
                <strong>Tổng tiền:</strong>
              </span>
              <span className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalAmount)}
              </span>
            </div>
          </div>

          <Form.Item
            name="color"
            label="Màu sắc"
            initialValue={selectedVehicle?.color}
          >
            <Input disabled style={{ fontWeight: "500", color: "#000" }} />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Mức độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên" }]}
            initialValue="NORMAL"
          >
            <Select placeholder="Chọn mức độ ưu tiên">
              <Option value="LOW">
                <Tag color="green">Thấp</Tag>
              </Option>
              <Option value="NORMAL">
                <Tag color="blue">Trung bình</Tag>
              </Option>
              <Option value="HIGH">
                <Tag color="red">Cao</Tag>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="requiredDate"
            label="Ngày cần xe"
            rules={[{ required: true, message: "Vui lòng chọn ngày cần xe" }]}
            initialValue={dayjs().add(7, 'day')}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày cần xe"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
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
              <strong>Xe:</strong> {selectedVehicle?.modelName}
            </p>
            <p className="mb-2">
              <strong>Phiên bản:</strong> {selectedVehicle?.variantName}
            </p>
            <p className="mb-2">
              <strong>VIN:</strong> {selectedVehicle?.vinNumber}
            </p>
            <p className="mb-2">
              <strong>Giá:</strong> {selectedVehicle?.listingPrice}
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}