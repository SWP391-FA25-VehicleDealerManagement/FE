import React from "react";
import Login from "../../sections/authen/login.jsx";
import { Helmet } from "react-helmet";
const LoginPage = () => {
  return (
    <div
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: "#253343",
      }}
    >
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Login />
    </div>
  );
};

export default LoginPage;
