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
  Image, // <-- ĐÃ THÊM
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
import axiosClient from "../../../../config/axiosClient"; 

const { Title } = Typography;
const { Option } = Select;

export default function RequestVehicle() {
  const navigate = useNavigate();
  const { evmVehiclesList, isLoadingEVMVehicles, fetchEVMVehicles } = useVehicleStore();
  const { userDetail } = useAuthen();
  const { createRequestVehicle, isLoadingCreateRequest } = useDealerRequest();
  const [searchText, setSearchText] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [form] = Form.useForm();
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
  });
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    fetchEVMVehicles();
  }, [fetchEVMVehicles]);

  useEffect(() => {
    const objectUrlsToRevoke = [];

    const fetchAllImages = async () => {
      if (evmVehiclesList && evmVehiclesList.length > 0) {
        // Lọc ra những images chưa được fetch
        const imagesToFetch = evmVehiclesList.filter(
          (vehicle) => vehicle.imageUrl && !imageUrls[vehicle.imageUrl]
        );

        if (imagesToFetch.length === 0) return;

        // Tạo mảng các promise để tải ảnh song song
        const fetchPromises = imagesToFetch.map(async (vehicle) => {
          try {
            const response = await axiosClient.get(vehicle.imageUrl, {
              responseType: "blob",
            });
            const objectUrl = URL.createObjectURL(response.data);
            objectUrlsToRevoke.push(objectUrl);
            return {
              path: vehicle.imageUrl,
              url: objectUrl,
            };
          } catch (error) {
            console.error("Không thể tải ảnh:", vehicle.imageUrl, error);
            return {
              path: vehicle.imageUrl,
              url: null, 
            };
          }
        });

        // Chờ tất cả ảnh được tải về
        const results = await Promise.all(fetchPromises);

        // Merge với imageUrls hiện tại thay vì replace hoàn toàn
        setImageUrls((prev) => {
          const newImageUrls = { ...prev };
          results.forEach((result) => {
            if (result) {
              newImageUrls[result.path] = result.url;
            }
          });
          return newImageUrls;
        });
      }
    };

    fetchAllImages();

    // Xóa các Object URL khi component unmount
    return () => {
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [evmVehiclesList.length]);

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
    const unitPrice = vehicle?.msrp || 0;
    setTotalAmount(unitPrice);
    setCurrentQuantity(1);
    form.setFieldsValue({ quantity: 1 });
  };

  const handleOrderCancel = () => {
    setIsOrderModalOpen(false);
    setSelectedVehicle(null);
    setTotalAmount(0);
    setCurrentQuantity(1);
    form.resetFields();
  };

  const handleQuantityChange = (value) => {
    if (selectedVehicle && value) {
      const newQuantity = value || 1;
      setCurrentQuantity(newQuantity);
      const unitPrice = selectedVehicle?.msrp || 0;
      setTotalAmount(unitPrice * newQuantity);
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
      const unitPrice = selectedVehicle?.msrp || 0;

      // Tạo request data theo đúng format API
      const requestData = {
        dealerId: dealerId,
        userId: userId,
        requiredDate: values.requiredDate
          ? values.requiredDate.toISOString()
          : new Date().toISOString(),
        priority: values.priority || "NORMAL",
        notes: values.notes || "",
        requestDetails: [
          {
            variantId: variantId,
            color: values.color || selectedVehicle?.color,
            quantity: values.quantity,
            unitPrice: unitPrice,
            notes: values.notes || "",
          },
        ],
      };


      // Gọi API tạo dealer request
      const response = await createRequestVehicle(requestData);

      if (response && response.status === 200) {
        toast.success(
          `Đã gửi yêu cầu đặt ${values.quantity} xe ${selectedVehicle.modelName}  ${selectedVehicle.variantName} thành công!`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
          }
        );

        setIsOrderModalOpen(false);
        setSelectedVehicle(null);
        form.resetFields();
        setCurrentQuantity(1);
      } else {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error("Error ordering vehicle:", error);

      // Xử lý error message từ API
      const errorMessage =
        error.response?.data?.message ||
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
      dataIndex: "imageUrl",
      key: "imageUrl",
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
      title: "Giá niêm yết (VNĐ)",
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
        {isLoadingEVMVehicles ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={evmVehiclesList}
            rowKey="vehicleId"
            pagination={pagination}
            onChange={(pagination) => setPagination(pagination)}
            scroll={{ x: 2100 }}
          />
        )}
      </Card>

      {/* Modal đặt xe */}
      <Modal
        title={`Đặt xe: ${selectedVehicle?.modelName} ${selectedVehicle?.variantName}`}
        open={isOrderModalOpen}
        onOk={handleOrderSubmit}
        onCancel={handleOrderCancel}
        confirmLoading={isLoadingCreateRequest}
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
                {selectedVehicle?.msrp != null
                  ? new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedVehicle.msrp)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-lg">
                <strong>Số lượng:</strong>
              </span>
              <span className="text-lg font-bold">
                {form.getFieldValue("quantity") || 1} xe
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
            rules={[
              { required: true, message: "Vui lòng chọn mức độ ưu tiên" },
            ]}
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
            initialValue={dayjs().add(7, "day")}
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
            <Input.TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
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
              <strong>Giá:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedVehicle?.msrp)}
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
