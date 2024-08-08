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
              <Form.Item name="id" label="Mã học phần" required>
                <Input />
              </Form.Item>
              <Form.Item name="name" label="Tên học phần" required>
                <Input />
              </Form.Item>
              <Form.Item name="major" label="Chuyên ngành">
                <Input />
              </Form.Item>
              <div className="flex flex-row gap-8">
                <Form.Item name="semester" label="Học kỳ" required>
                  <InputNumber />
                </Form.Item>
                <Form.Item name="credits" label="Số tín chỉ" required>
                  <InputNumber />
                </Form.Item>
              </div>
              <Form.Item name="type" label="Loại học phần" required>
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
            </Form>
            <div className="flex justify-end mb-20 gap-4">
              <Button type="primary">Thêm học phần</Button>
              <Button type="primary" onClick={() => navigate(-1)}>
                Trở về
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
