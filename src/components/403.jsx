import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import useAuthen from "../hooks/useAuthen";

const Error = () => {
  const navigate = useNavigate();
  const { role, isAuthenticated , logout} = useAuthen();

   const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Navigate based on user role
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'DEALER_MANAGER':
        navigate('/dealer-manager/dashboard', { replace: true });
        break;
      case 'DEALER_STAFF':
        navigate('/dealer-staff/dashboard', { replace: true });
        break;
      case 'EVM_STAFF':
        navigate('/evm-staff/dealer-list', { replace: true });
        break;
      default:
        handleLogout();
    }
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
      extra={[
        <Button type="primary" onClick={handleGoToDashboard} key="dashboard">
          Quay về
        </Button>,
      ]}
    />
  );
};

export default Error;