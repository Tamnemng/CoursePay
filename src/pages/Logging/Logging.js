import "./Logging.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Input, Button, Radio, Space, message } from "antd";

export default function Logging() {
  const navigate = useNavigate();
  const [value, setValue] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("role");
    console.log(
      "Initial isAuthenticated:",
      localStorage.getItem("isAuthenticated")
    );
  }, []);

  const checking = async () => {
    if (!username || !password) {
      message.error("Vui lòng điền tên đăng nhập và mật khẩu!");
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (username === "123" && password === "123") {
        message.success("Đăng nhập thành công!");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "lastActivityTime",
          new Date().getTime().toString()
        );
        localStorage.setItem("role", value.toString());
        console.log(
          "Login successful, isAuthenticated:",
          localStorage.getItem("isAuthenticated")
        );
        console.log("Role set to:", value);

        window.dispatchEvent(new CustomEvent("roleChanged", { detail: value }));

        if (value === 1) {
          navigate("/home");
        } else if (value === 2) {
          navigate("/courseChange");
        } else if (value === 3) {
          navigate("/tuitionChange");
        }
      } else {
        message.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi đăng nhập");
    }
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checking();
    }
  };

  return (
    <div className="Web">
      <header className="Web-header">
        <div className="Logging">
          <div className="mb-4">Đăng nhập</div>
          <div className="">
            <div className="flex left-0 text-lg">Tên đăng nhập</div>
            <Input
            //   placeholder="input username"
              className="input-field"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <div className="flex left-0 text-lg">Mật khẩu</div>
            <Input.Password
            //   placeholder="input password"
              className="input-field"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button type="primary" onClick={checking} className="input-button">
            Đăng nhập
          </Button>
          <Radio.Group onChange={onChange} value={value}>
            <Space className="!flex !flex-col gap-8 p-4 mb-4">
              <Radio value={1} className="absolute left-36 radio-button">
                Sinh Viên
              </Radio>
              <Radio value={2} className="absolute left-36 radio-button">
                Phòng giáo vụ
              </Radio>
              <Radio value={3} className="absolute left-36 radio-button">
                Phòng tài vụ
              </Radio>
            </Space>
          </Radio.Group>
        </div>
      </header>
    </div>
  );
}
