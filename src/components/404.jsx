import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthen from "../hooks/useAuthen";

const Error = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuthen();

  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Navigate based on user role
    switch (role) {
      case "ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "DEALER_MANAGER":
        navigate("/dealer/dashboard", { replace: true });
        break;
      case "DEALER_STAFF":
        navigate("/dealer-staff/dashboard", { replace: true });
        break;
      case "EVM_STAFF":
        navigate("/evm/dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      extra={
        <Button type="primary" onClick={handleGoToDashboard}>
          Quay về
        </Button>
      }
    />
  );
};

export default Error;
