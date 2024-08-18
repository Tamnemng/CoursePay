import React from "react";
import Header from "../../components/courseHeader";
import { useNavigate } from "react-router-dom";
import { addGeneralSubject } from "../../data/subjects";
import { Button, Form, Input, InputNumber, Select, message } from "antd";

export default function CreateGeneralSubject() {
  const navigate = useNavigate();
  const [createForm] = Form.useForm();

  const handleCreateSubject = async () => {
    try {
      const values = await createForm.validateFields();
      const subjectData = {
        faculty: values.faculty,
        semester: values.semester,
        type: values.type,
        id: values.id,
        name: values.name,
        credits: values.credits,
      };

      const result = await addGeneralSubject(subjectData);
      console.log("addMajorSubject result:", result);

      if (result.status === "success") {
        message.success("Thêm học phần thành công.");
        navigate("/generalSubjectChange");
      } else {
        console.error(result.message);
        message.error("Mã học phần đã tồn tại.");
      }
    } catch (error) {
      console.error("Error in handleCreateSubject:", error);
      message.error("Thêm học phần thất bại.");
    }
  };

  return (
    <div className="flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Thêm học phần
        </h1>
        <div>
          <div className="m-20 mx-96">
            <Form form={createForm} onFinish={handleCreateSubject}>
              <Form.Item
                name="faculty"
                label="Khoa"
                rules={[{ required: true, message: "Please enter faculty" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="semester"
                label="Học kỳ"
                rules={[{ required: true, message: "Please enter semester" }]}
              >
                <Select
                  options={[
                    {
                      value: "HK1",
                      label: "HK1",
                    },
                    {
                      value: "HK2",
                      label: "HK2",
                    },
                    {
                      value: "HK3",
                      label: "HK3",
                    },
                    {
                      value: "HK4",
                      label: "HK4",
                    },
                    {
                      value: "HK5",
                      label: "HK5",
                    },
                    {
                      value: "HK6",
                      label: "HK6",
                    },
                    {
                      value: "HK7",
                      label: "HK7",
                    },
                    {
                      value: "HK8",
                      label: "HK8",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="type"
                label="Loại học phần"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select
                  options={[
                    {
                      value: "mandatory",
                      label: "Bắt buộc",
                    },
                    {
                      value: "elective",
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
                <InputNumber min={1} max={6} />
              </Form.Item>
              <Form.Item>
                <div className="flex justify-end mb-20 gap-4">
                  <Button type="primary" htmlType="submit">
                    Thêm học phần
                  </Button>
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
