import React from "react";
import ContentLayout from "../../../components/ContentLayout";
import Header from "../../../components/courseHeader";
import { Form, Button, Input, Select, InputNumber, Table } from "antd";
import { majorSubject } from "../index";
import { useNavigate, useParams } from "react-router-dom";

export default function MajorSubjectChangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const subject = majorSubject.find((subject) => subject.id === id);

  if (!subject) {
    return (
      <div className="flex">
        <Header />
        <div className="text-3xl my-4 grow flex flex-col">
          <h1 className="flex justify-center items-center my-4 text-black font-semibold">
            Thêm học phần
          </h1>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: "Mã lớp học phần",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Giảng viên",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Số lượng",
      dataIndex: "enrolled",
      key: "enrolled",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          // onClick={() => {
          //   navigate(`/majorSubjectChange/${text}`);
          // }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Thông tin học phần
        </h1>
        <div>
          <div className="flex justify-end mr-10 mb-20 gap-4">
            <Button type="primary" onClick={() => navigate(-1)}>
              Trở về
            </Button>
          </div>
          <div className="m-20 mx-96">
            <Form>
              <Form.Item name="id" label="Mã học phần">
                <Input defaultValue={subject.id} />
              </Form.Item>
              <Form.Item name="name" label="Tên học phần">
                <Input defaultValue={subject.name} />
              </Form.Item>
              <Form.Item name="major" label="Chuyên ngành">
                <Input defaultValue={subject.major} />
              </Form.Item>
              <div className="flex flex-row gap-8">
                <Form.Item name="semester" label="Học kỳ">
                  <InputNumber defaultValue={subject.semester} />
                </Form.Item>
                <Form.Item name="credits" label="Số tín chỉ">
                  <InputNumber defaultValue={subject.credits} />
                </Form.Item>
              </div>
              <Form.Item name="type" label="Loại học phần">
                <Select
                  defaultValue={subject.type}
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
          </div>
          <div className="flex justify-end mr-10 mb-20 gap-4">
            {/* <Button type="primary">xem danh sách lớp học phần</Button> */}
            <Button type="primary">Lưu thay đổi</Button>
            <Button type="primary" danger>
              Xóa học phần
            </Button>
          </div>
          <div>
            <span className="text-2xl m-12">Danh sách các lớp học phần</span>
            <div className="m-10">
              <Table
                columns={columns}
                dataSource={subject.classSections}
                tableLayout="auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
