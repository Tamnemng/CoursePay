import "./Logging.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Input, Button, Radio, Space, message, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login, getUserRole } from "./loggingData";

export default function Logging() {
  const navigate = useNavigate();
  const [value, setValue] = useState(1);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("role");
    console.log(
      "Initial isAuthenticated:",
      localStorage.getItem("isAuthenticated")
    );
  }, []);

  const onFinish = async (values) => {
    const result = await login(values.email, values.password);

    if (result.status === "success") {
      try {
        const userInfo = await getUserRole();
        const role = userInfo?.role || value;
        if (role === 1 && value === 1) {
          localStorage.setItem("role", value.toString());
          localStorage.setItem("isAuthenticated", "true");
          message.success("Đăng nhập thành công");
          navigate("/tuition/pay");

        } else if (role === 2 && value === 2) {
          localStorage.setItem("role", value.toString());
          localStorage.setItem("isAuthenticated", "true");
          message.success("Đăng nhập thành công");
          navigate("/generalSubjectChange");

        } else if (role === 3 && value === 3) {
          localStorage.setItem("role", value.toString());
          localStorage.setItem("isAuthenticated", "true");
          message.success("Đăng nhập thành công");
          navigate("/tuitionMain");

        } else {
          console.log("roleeee: ", role, "valueee: ", value);
        }
      } catch (error) {
        message.error("Failed to get user role: " + error.message);
      }
    } else {
      message.error("Sign in failed: " + result.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <div className="Logging">
          <Form
            name="normal_login"
            labelCol={{ span: 5 }}
            className="login-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className="mb-4 text-3xl">Đăng nhập</div>
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: "Email không hợp lệ" },
                { required: true, message: "Vui lòng nhập email" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className="input-button" htmlType="submit">
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <Radio.Group onChange={onChange} value={value}>
                <Space className="flex justify-center items-center p-4">
                  <Radio value={1} className="radio-button">
                    Sinh Viên
                  </Radio>
                  <Radio value={2} className="radio-button">
                    Phòng giáo vụ
                  </Radio>
                  <Radio value={3} className="radio-button">
                    Phòng tài vụ
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </header>
    </div>
  );
}
