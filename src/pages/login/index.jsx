import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import { toast } from "react-toastify";
import { Input, Button, Form } from "antd";
import apiInstance from "../../utils/api";
import TopImage from "../../assets/images/top.png";
import BottomImage from "../../assets/images/bottom.png";

const Login = () => {
  const navigate = useNavigate();
  // const params = useLocation();
  const userContextData = useContext(userContext);

  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");

  const handleLogin = (values) => {
    apiInstance({
      url: "/api/auth/login",
      method: "POST",
      params: values,
    }).then((response) => {
      const responseData = response.data;

      if (responseData?.token) {
        userContextData.setUser(responseData);

        const { token, userId } = responseData;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        navigate("/");
        toast.success("Đăng nhập thành công!");
      } else {
        toast.error("Tài khoản hoặc mật khẩu không hợp lệ!");
      }
    });
  };

  return (
    <div className="w-full flex relative h-screen">
      <div className="w-8/12 border">
        <div className="w-full flex justify-between flex-col">
          <div className="px-[40px] text-[20px] py-[24px] mb-[93px]">
            Quản lý đồ án
          </div>
          <div className="w-5/12 mx-auto">
            <Form onFinish={handleLogin}>
              {" "}
              {/* Wrap the form with Form component */}
              <Form.Item label="Tài khoản" name="username" rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}>
                <Input placeholder="Tài khoản" />
              </Form.Item>
              <Form.Item label="Mật khẩu" name="password"  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item className="ml-20">
                <Button type="default" htmlType="submit">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <img className="absolute top-0 right-0" src={TopImage} alt="" />
      <img
        className="absolute bottom-0 right-[30px]"
        src={BottomImage}
        alt=""
      />
    </div>
  );
};

export default Login;
