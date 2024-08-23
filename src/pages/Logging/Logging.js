import "./Logging.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Input, Button, Radio, Space, message, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login, getUserRole } from "./loggingData";

export default function Logging() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(1);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("role");
    console.log(
      "Initial isAuthenticated:",
      localStorage.getItem("isAuthenticated")
    );
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);

      if (result.status === "success") {
        const userInfo = await getUserRole();
        const userRole = userInfo?.role;

        if (userRole && userRole === selectedRole) {
          localStorage.setItem("role", userRole.toString());
          localStorage.setItem("isAuthenticated", "true");
          message.success("Đăng nhập thành công");

          switch (userRole) {
            case 1:
              // navigate("/tuition/pay");
              window.location.pathname = "/tuition/pay";
              break;
            case 2:
              // navigate("/generalSubjectChange");
              window.location.pathname = "/generalSubjectChange";
              break;
            case 3:
              // navigate("/tuitionMain");
              window.location.pathname = "/tuitionMain";
              break;
            default:
              message.error("Vai trò không hợp lệ");
          }
        } else {
          message.error("Đăng nhập thất bại.");
        }
      } else {
        message.error("Email hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      message.error("Lỗi khi đăng nhập: " + error.message);
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <div className="Logging bg-white/90">
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
              <Button type="primary" className="input-button" htmlType="submit" disabled={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <Radio.Group onChange={onChange} value={selectedRole}>
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
