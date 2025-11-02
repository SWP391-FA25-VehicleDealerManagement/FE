import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Card } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import useAuthen from "../../hooks/useAuthen";
import usePaymentStore from "../../hooks/usePayment";

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, role, isInitialized } = useAuthen();
  const { paymentSuccess } = usePaymentStore();
  const processedRef = useRef(false);

  useEffect(() => {
    // ✅ Prevent multiple processing
    if (processedRef.current) {
      console.log("⛔ Already processed, skipping...");
      return;
    }

    console.log("🔍 PaymentCallback - Auth State:", {
      isInitialized,
      isAuthenticated,
      role,
      searchParams: searchParams.toString(),
    });

    // Đợi auth state được khởi tạo
    if (!isInitialized) {
      console.log("⏳ Waiting for auth initialization...");
      return;
    }

    // Nếu chưa đăng nhập, redirect về login
    if (!isAuthenticated) {
      console.error("❌ Not authenticated, redirecting to login");
      processedRef.current = true;
      navigate("/", { replace: true });
      return;
    }

    const pendingPaymentStr = sessionStorage.getItem("pendingVNPayPayment");
    console.log("📦 Pending Payment Data:", pendingPaymentStr);

    if (!pendingPaymentStr) {
      console.warn("⚠️ No pending payment found, redirecting to default page");
      processedRef.current = true;
      const defaultUrl =
        role === "DEALER_MANAGER"
          ? "/dealer-manager/dealer-orders"
          : role === "DEALER_STAFF"
          ? "/dealer-staff/orders"
          : "/";

      navigate(defaultUrl, { replace: true });
      return;
    }

    // ✅ Xử lý VNPay callback ở đây
    const handleCallback = async () => {
      try {
        processedRef.current = true;

        const pendingPayment = JSON.parse(pendingPaymentStr);
        const vnpResponseCode = searchParams.get("vnp_ResponseCode");
        const vnpTransactionStatus = searchParams.get("vnp_TransactionStatus");

        console.log("🔍 VNPay Response:", {
          responseCode: vnpResponseCode,
          transactionStatus: vnpTransactionStatus,
        });

        // ✅ Kiểm tra kết quả thanh toán
        if (vnpResponseCode === "00" && vnpTransactionStatus === "00") {
          // Thanh toán thành công
          const statusToUpdate =
            pendingPayment.paymentType === "FULL" ? "PAID" : "PARTIAL";

          await paymentSuccess(pendingPayment.orderId, statusToUpdate);

          toast.success("Thanh toán VNPay thành công!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          // Thanh toán thất bại
          toast.error("❌ Thanh toán VNPay thất bại hoặc đã bị hủy!", {
            position: "top-right",
            autoClose: 3000,
          });
        }

        // ✅ Clear pending payment
        sessionStorage.removeItem("pendingVNPayPayment");

        // ✅ Redirect về trang order list (KHÔNG có query params)
        const redirectUrl =
          pendingPayment.userRole === "DEALER_MANAGER"
            ? "/dealer-manager/dealer-orders"
            : "/dealer-staff/orders";

        console.log("✅ Redirecting to:", redirectUrl);
        navigate(redirectUrl, { replace: true });
      } catch (error) {
        console.error("❌ Error processing VNPay callback:", error);
        toast.error("Đã xảy ra lỗi khi xử lý kết quả thanh toán");

        // Vẫn redirect về trang order list
        sessionStorage.removeItem("pendingVNPayPayment");
        const defaultUrl =
          role === "DEALER_MANAGER"
            ? "/dealer-manager/dealer-orders"
            : "/dealer-staff/orders";
        navigate(defaultUrl, { replace: true });
      }
    };

    handleCallback();
  }, [navigate, searchParams, isAuthenticated, role, isInitialized, paymentSuccess]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card style={{ textAlign: "center", padding: 40 }}>
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          size="large"
        />
        <h3 style={{ marginTop: 20 }}>Đang xử lý kết quả thanh toán...</h3>
      </Card>
    </div>
  );
}