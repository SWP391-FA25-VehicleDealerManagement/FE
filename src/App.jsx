import { useEffect } from "react";
import "./App.css";
import Routes from "./route";
import useAuthen from "./hooks/useAuthen";
import { ConfigProvider } from "antd";
function App() {
  const { initAuth } = useAuthen();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <ConfigProvider>
      <Routes />
    </ConfigProvider>
  );
}

export default App;
