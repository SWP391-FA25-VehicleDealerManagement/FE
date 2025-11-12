// components/order/PaymentModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Button,
  Spin,
  Descriptions,
  Typography,
  Row,
  Col,
  Alert,
} from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
} from "@ant-design/icons";
import usePaymentStore from "../../../../hooks/usePayment";
import useCustomerDebt from "../../../../hooks/useCustomerDebt";
import { toast } from "react-toastify";
import useAuthen from "../../../../hooks/useAuthen";

const { Option } = Select;
const { Title, Text } = Typography;

export default function PaymentModal({ isOpen, onClose, order }) {
  const [form] = Form.useForm();
  const {
    createPayment,
    createPaymentWithVNPay,
    isLoadingCreatePayment,
    isLoadingCreateVNPayPayment,
    paymentSuccess,
    isPaymentSuccessLoading,
  } = usePaymentStore();
  const { createCustomerDebtFromPayment, isLoadingCreateCustomerDebt } =
    useCustomerDebt();
  const { userDetail } = useAuthen();
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const paymentType = Form.useWatch("paymentType", form);
  const paymentMethod = Form.useWatch("paymentMethod", form);
  const installmentPercentage = Form.useWatch("installmentPercentage", form);

  useEffect(() => {
    if (isOpen && order) {
      const initialAmount = order.totalPrice || 0;
      form.setFieldsValue({
        paymentMethod: "CASH",
        paymentType: "FULL",
        installmentPercentage: 20,
      });
      setCalculatedAmount(initialAmount);
    } else {
      form.resetFields();
      setCalculatedAmount(0);
    }
  }, [isOpen, order, form]);

  useEffect(() => {
    if (!order) return;
    const total = order.totalPrice || 0;

    if (paymentType === "FULL") {
      setCalculatedAmount(total);
    } else if (paymentType === "INSTALLMENT") {
      const percentage = installmentPercentage || 0;
      const amount = (total * percentage) / 100;
      setCalculatedAmount(amount);
    }
  }, [paymentType, installmentPercentage, order]);

  const handleFinish = async (values) => {
    if (!order) return;

    const orderId = order?.orderId;
    const dealerId = userDetail?.dealer?.dealerId;

    if (!dealerId || !orderId) {
      toast.error("Không thể xác định ID Đại lý hoặc ID Đơn hàng.");
      return;
    }

    // ✅ Validate số tiền tối thiểu cho VNPay
    if (values.paymentMethod === "BANK_TRANSFER" && calculatedAmount < 10000) {
      toast.error("Số tiền thanh toán VNPay tối thiểu là 10,000 VND");
      return;
    }

    // ========== XỬ LÝ VNPAY (BANK_TRANSFER) ==========
    if (values.paymentMethod === "BANK_TRANSFER") {
      try {
        const vnpayPayload = {
          orderId: order.orderId,
          amount: calculatedAmount,
          paymentMethod: "BANK_TRANSFER",
          paymentType: values.paymentType,
        };

        console.log("Creating VNPay payment with payload:", vnpayPayload);

        // Gọi API tạo VNPay URL
        const response = await createPaymentWithVNPay(vnpayPayload);

        console.log("VNPay response:", response);

        if (response?.data?.data?.vnpayUrl) {
          // Lưu thông tin vào sessionStorage để xử lý sau khi callback
          sessionStorage.setItem(
            "pendingVNPayPayment",
            JSON.stringify({
              orderId,
              paymentType: values.paymentType,
              installmentPercentage: values.installmentPercentage,
              paymentId: response.data.data.paymentId,
              userRole: "DEALER_STAFF", // ✅ Lưu role để redirect đúng
            })
          );

          toast.info("Đang chuyển đến cổng thanh toán VNPay...");

          // Redirect đến VNPay
          window.location.href = response.data.data.vnpayUrl;
        } else {
          toast.error("Không thể tạo link thanh toán VNPay");
        }
      } catch (error) {
        console.error("Lỗi tạo VNPay payment:", error);
        toast.error(
          error.response?.data?.message ||
            "Đã xảy ra lỗi khi tạo thanh toán VNPay"
        );
      }
      return; // Dừng xử lý tiếp
    }

    // ========== XỬ LÝ TIỀN MẶT (CASH) - GIỮ NGUYÊN ==========
    const paymentPayload = {
      orderId: order.orderId,
      amount: calculatedAmount,
      paymentMethod: values.paymentMethod,
      paymentType: values.paymentType,
    };

    try {
      // B1: Tạo thanh toán
      const paymentResponse = await createPayment(paymentPayload);

      if (paymentResponse && paymentResponse.status === 200) {
        // Lấy paymentId từ response (giả định cấu trúc data)
        const newPaymentId = paymentResponse.data?.data?.paymentId;
        if (!newPaymentId) {
          toast.warn(
            "Tạo thanh toán thành công nhưng không lấy được ID thanh toán để tạo công nợ."
          );
          return;
        }

        // B2: Cập nhật trạng thái đơn hàng
        const statusToUpdate =
          values.paymentType === "FULL" ? "PAID" : "PARTIAL";
        const successResponse = await paymentSuccess(orderId, statusToUpdate);

        if (successResponse && successResponse.status === 200) {
          // B3: Tạo công nợ khách hàng (chỉ khi có newPaymentId)
          if (values.paymentType === "INSTALLMENT") {
            const debtResponse = await createCustomerDebtFromPayment(
              newPaymentId
            );
            if (debtResponse && debtResponse.status === 200) {
              toast.success("Thanh toán thành công!");
            } else {
              toast.warn("Thanh toán thành công nhưng tạo công nợ thất bại.");
            }
          } else {
            toast.success("Thanh toán và cập nhật trạng thái thành công!");
          }

          onClose();
        } else {
          toast.error(
            "Tạo thanh toán thành công nhưng cập nhật trạng thái đơn hàng thất bại."
          );
        }
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      toast.error("Đã xảy ra lỗi trong quá trình thanh toán.");
    }
  };

  return (
    <Modal
      title={
        <Title level={4}>
          <CreditCardOutlined /> Thanh toán Đơn hàng #{order?.orderId}
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={
            isLoadingCreatePayment ||
            isLoadingCreateVNPayPayment ||
            isPaymentSuccessLoading
          }
          onClick={() => form.submit()}
          icon={
            paymentMethod === "BANK_TRANSFER" ? (
              <BankOutlined />
            ) : (
              <CreditCardOutlined />
            )
          }
        >
          {paymentMethod === "BANK_TRANSFER"
            ? "Thanh toán qua VNPay"
            : "Xác nhận Thanh toán"}
        </Button>,
      ]}
      width={600}
    >
      {/* Alert khi chọn BANK_TRANSFER */}
      {paymentMethod === "BANK_TRANSFER" && (
        <Alert
          message="Thanh toán qua VNPay"
          description="Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch."
          type="info"
          showIcon
          icon={<BankOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {order && (
        <Descriptions
          bordered
          size="small"
          column={1}
          style={{ marginBottom: 24 }}
        >
          <Descriptions.Item label="Khách hàng">
            <Text strong>{order.customerName || "N/A"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền đơn hàng">
            <Text strong>
              {(order.totalPrice || 0).toLocaleString("vi-VN")} VNĐ
            </Text>
          </Descriptions.Item>
        </Descriptions>
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paymentMethod"
              label="Phương thức thanh toán"
              rules={[
                { required: true, message: "Vui lòng chọn phương thức!" },
              ]}
            >
              <Select placeholder="Chọn phương thức">
                <Option value="CASH">
                  <DollarOutlined /> Tiền mặt
                </Option>
                <Option value="BANK_TRANSFER">
                  <BankOutlined /> Chuyển khoản (VNPay)
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="paymentType"
              label="Hình thức thanh toán"
              rules={[{ required: true, message: "Vui lòng chọn hình thức!" }]}
            >
              <Select placeholder="Chọn hình thức">
                <Option value="FULL">Thanh toán toàn bộ</Option>
                <Option value="INSTALLMENT">Trả góp</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Conditional Percentage Input */}
        {paymentType === "INSTALLMENT" && (
          <Form.Item
            name="installmentPercentage"
            label="Phần trăm trả góp (%)"
            rules={[
              { required: true, message: "Vui lòng chọn phần trăm trả góp!" },
            ]}
          >
            <Select placeholder="Chọn phần trăm trả góp">
              {[20, 30, 40, 50, 60, 70, 80, 90].map((percent) => (
                <Option key={percent} value={percent}>
                  {percent}%
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Display Calculated Amount */}
        <Descriptions
          bordered
          size="small"
          column={1}
          style={{ marginTop: 16 }}
        >
          <Descriptions.Item
            label={
              <>
                <DollarOutlined /> Số tiền thanh toán
              </>
            }
          >
            <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
              {calculatedAmount.toLocaleString("vi-VN")} VNĐ
            </Title>
          </Descriptions.Item>
        </Descriptions>
      </Form>
    </Modal>
  );
}
