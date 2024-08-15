import { Button, Form, Input, InputNumber, Select } from "antd";
import React from "react";
import Header from "../../components/courseHeader";
import { useNavigate } from "react-router-dom";

export default function CreateSubject() {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Thêm học phần
        </h1>
        <div>
          <div className="m-20 mx-96">
            <Form>
              <Form.Item
                name="faculty"
                label="Khoa"
                rules={[{ required: true, message: "Please enter faculty" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="major"
                label="Chuyên ngành"
                rules={[{ required: true, message: "Please enter major" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="semester"
                label="Học kỳ"
                rules={[{ required: true, message: "Please enter semester" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type"
                label="Loại học phần"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select
                  options={[
                    {
                      value: "Bắt buộc",
                      label: "Bắt buộc",
                    },
                    {
                      value: "Tự chọn",
                      label: "Tự chọn",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="id"
                label="Mã học phần"
                rules={[{ required: true, message: "Please enter subject ID" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Tên học phần"
                rules={[{ required: true, message: "Please enter class name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="credits"
                label="Số tín chỉ"
                rules={[{ required: true, message: "Please enter credits" }]}
              >
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end mb-20 gap-4">
                  <Button type="primary">Thêm học phần</Button>
                  <Button onClick={() => navigate(-1)}>Hủy</Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
