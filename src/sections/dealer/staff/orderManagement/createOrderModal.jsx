// components/order/createOrderModal.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Button, Select, Spin, Row, Col, Typography, Empty } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import useDealerOrder from "../../../../hooks/useDealerOrder";
import useVehicleStore from "../../../../hooks/useVehicle"; // Import store xe
import useAuthen from "../../../../hooks/useAuthen";
import { debounce } from "lodash";
import axiosClient from "../../../../config/axiosClient"; // Giả định bạn có axiosClient

const { Option } = Select;
const { Text } = Typography;

const apiFindCustomerByPhone = async (phone) => {
  // Đây là nơi bạn gọi API thật
  // await axiosClient.get(`/customers/find-by-phone?phone=${phone}`);
  
  // Dữ liệu giả lập
  if (phone === "0909123456") {
    return {
      status: 200,
      data: {
        customerId: "CUS-001",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
      },
    };
  }
  return null;
};

export default function CreateOrderModal({ isOpen, onClose, onOrderCreated }) {
  const [form] = Form.useForm();
  const { userDetail } = useAuthen();
  const { dealerCarLists, fetchVehicleDealers, isLoading: isLoadingVehicles } = useVehicleStore(); //
  const { createDealerOrder, isLoadingCreateOrder } = useDealerOrder(); //
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isFindingCustomer, setIsFindingCustomer] = useState(false);

  useEffect(() => {
    if (isOpen && userDetail && userDetail.dealer && userDetail.dealer.dealerId) {
      fetchVehicleDealers(userDetail.dealer.dealerId); //
    }
  }, [isOpen, userDetail, fetchVehicleDealers]);

  const debouncedSearch = useCallback(
    debounce(async (phone) => {
      if (phone && phone.length >= 10) {
        setIsFindingCustomer(true);
        setCustomerInfo(null);
        try {
          const response = await apiFindCustomerByPhone(phone);
          if (response && response.status === 200) {
            setCustomerInfo(response.data);
            form.setFieldsValue({
              customerName: response.data.fullName,
              customerEmail: response.data.email,
            });
          } else {
             form.setFieldsValue({
              customerName: "",
              customerEmail: "",
            });
          }
        } catch (error) {
          toast.error("Không tìm thấy khách hàng.");
        } finally {
          setIsFindingCustomer(false);
        }
      }
    }, 500), // Delay 500ms
    [form]
  );

  const handlePhoneChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Xử lý khi submit form
  const handleSubmit = async (values) => {
    if (!customerInfo) {
      toast.error("Vui lòng tìm và xác nhận thông tin khách hàng.");
      return;
    }

    const payload = {
      customerId: customerInfo.customerId,
      dealerId: userDetail.dealer.dealerId,
      vehicleIds: values.vehicleIds,
      // Thêm các trường khác nếu cần
    };

    try {
      await createDealerOrder(payload); //
      toast.success("Tạo đơn hàng thành công!");
      form.resetFields();
      setCustomerInfo(null);
      onOrderCreated(); // Gọi callback để list tải lại
    } catch (error) {
      toast.error("Tạo đơn hàng thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      title="Tạo đơn hàng mới"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Huỷ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoadingCreateOrder}
          onClick={() => form.submit()}
        >
          Tạo đơn hàng
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="customerPhone"
              label="Số điện thoại khách hàng"
              rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                onChange={handlePhoneChange}
                placeholder="Nhập SĐT để tìm..."
              />
            </Form.Item>
          </Col>
          <Col span={12} style={{ display: 'flex', alignItems: 'center', paddingTop: '30px' }}>
            {isFindingCustomer && <Spin size="small" />}
          </Col>
        </Row>

        {customerInfo && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerName" label="Tên khách hàng">
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="customerEmail" label="Email">
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item
          name="vehicleIds"
          label="Chọn xe"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất 1 xe!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Chọn xe từ kho của đại lý"
            loading={isLoadingVehicles}
            notFoundContent={isLoadingVehicles ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có xe" />}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {dealerCarLists.map((vehicle) => (
              <Option key={vehicle.vehicleId} value={vehicle.vehicleId} disabled={vehicle.status !== 'IN_DEALER_STOCK'}>
                {`${vehicle.modelName} ${vehicle.variantName} - ${vehicle.color} (VIN: ${vehicle.vinNumber})`}
                {vehicle.status !== 'IN_DEALER_STOCK' && <Text type="danger"> (Đã bán)</Text>}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}