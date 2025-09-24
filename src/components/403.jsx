import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
      extra={
        <Button type="primary" onClick={handleGoBack}>
          Quay lại
        </Button>
      }
    />
  );
};

export default Error;
