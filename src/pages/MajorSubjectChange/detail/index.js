import React, { useEffect, useState } from "react";
import ContentLayout from "../../../components/ContentLayout";
import Header from "../../../components/courseHeader";
import {
  Form,
  Button,
  Input,
  Select,
  InputNumber,
  Table,
  Modal,
  DatePicker,
  Tabs,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getMajorSubjects } from "../../../data/coursesData";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
const majorSubject = getMajorSubjects();
export default function MajorSubjectChangeDetail() {
  const { id } = useParams();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const subject = majorSubject.find((subject) => subject.id === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClassSection, setCurrentClassSection] = useState(null);

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
      render: (text, record) => (
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => showModal(record)}
          />
          <DeleteOutlined className="text-red-500 cursor-pointer" />
        </div>
      ),
    },
  ];

  const showModal = (classSection) => {
    setCurrentClassSection(classSection); // Cập nhật trạng thái với thông tin lớp học phần được chọn
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (!subject) {
      navigate("/notfound");
    }
  }, [subject, navigate]);

  if (!subject) {
    return null;
  }

  const subjectInfo = (
    <div className="text-3xl my-4 grow flex flex-col">
      <h1 className="flex justify-center items-center my-4 text-black font-semibold">
        Thông tin học phần
      </h1>
      <div>
        <div className="flex justify-end mr-10 gap-4">
          <Button type="primary" onClick={() => navigate(-1)}>
            Trở về
          </Button>
        </div>
        <div className="m-10">
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
          <Button type="primary">Lưu thay đổi</Button>
          <Button type="primary" danger>
            Xóa học phần
          </Button>
        </div>
      </div>
    </div>
  );

  const classSubject = (
    <div>
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center text-3xl items-center my-4 text-black font-semibold">
          Danh sách lớp học phần
        </h1>
        <div className="flex justify-end mr-10 gap-4">
          <Button type="primary" onClick={() => navigate(-1)}>
            Trở về
          </Button>
        </div>
      </div>

      <div className="m-10">
        <Table
          columns={columns}
          dataSource={subject.classSections}
          tableLayout="auto"
          rowKey="id"
        />
      </div>
      <div className="flex justify-end mr-10 mb-20 gap-4">
        <Button type="primary">Thêm lớp học phần</Button>
      </div>
      {currentClassSection && (
        <Modal
          title="Thông tin lớp học phần"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button type="primary" onClick={handleOk}>
              Lưu
            </Button>,
          ]}
        >
          <div>
            <Form>
              <Form.Item name="id" label="Mã lớp học phần">
                <Input defaultValue={currentClassSection.id} />
              </Form.Item>
              <Form.Item name="teacher" label="Giảng viên">
                <Input defaultValue={currentClassSection.teacher} />
              </Form.Item>
              <Form.Item name="dateRange" label="Thời gian">
                <RangePicker
                  defaultValue={[
                    moment(currentClassSection.startDate),
                    moment(currentClassSection.endDate),
                  ]}
                />
              </Form.Item>
              <Form.Item name="enrolled" label="Số lượng đăng ký">
                <InputNumber defaultValue={currentClassSection.enrolled} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </div>
  );

  const tabs = [
    {
      key: "1",
      label: "Danh sách học phần",
      children: subjectInfo,
    },
    {
      key: "2",
      label: "Danh sách lớp học phần",
      children: classSubject,
    },
  ];

  return (
    <div className="flex">
      <Header />
      <div className="w-full ml-4">
        <Tabs defaultActiveKey="1" items={tabs} onChange={onChange} />;
      </div>
    </div>
  );
}
