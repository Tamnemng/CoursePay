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
} from "antd";
import { addClassSection, getMajorSubjectDetail } from "../../../data/subjects";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function MajorSubjectChangeDetail() {
  const { id } = useParams();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const [subject, setSubject] = useState(null);
  const [classSection, setClassSection] = useState(null);

  useEffect(() => {
    getMajorSubjectDetail(id).then((result) => {
      if (result.status === "success") {
        const data = result.data;
        const classSections = Array.isArray(data.classSections)
          ? data.classSections
          : Object.values(data.classSections || {});

        setSubject({ ...data, classSections });
        form.setFieldsValue({
          id: data.id,
          name: data.name,
          major: data.major,
          semester: data.semester,
          credits: data.credits,
          type: data.type,
        });
      } else {
        console.error(result.message);
      }
    });
  }, [id, form]);

  useEffect(() => {
    if (classSection) {
      form.setFieldsValue({
        id: classSection.id,
        teacher: classSection.teacher,
        dateRange: [moment(classSection.startDate), moment(classSection.endDate)],
        size: classSection.size,
        enrolled: classSection.enrolled,
        timetable: classSection.timetable,
      });
    }
  }, [classSection, form]);

  const showModal = (classSection) => {
    setClassSection(classSection);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalCreateOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalCreateOpen(false);
  };

  const showmodalCreate = () => {
    setIsModalCreateOpen(true);
  };

  const modalCreate = () => {
    return (
      <Modal
        title="Thêm lớp học phần"
        open={isModalCreateOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form>
          <Form.Item
            name="id"
            label="Mã lớp học phần"
            rules={[{ required: true, message: "Please enter class ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teacher"
            label="Giảng viên"
            rules={[{ required: true, message: "Please enter teacher name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Thời gian"
            rules={[
              { required: true, message: "Please select the date range" },
            ]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="size"
            label="Số lượng"
            rules={[{ required: true, message: "Please enter class size" }]}
          >
            <InputNumber min={15} />
          </Form.Item>
          <Form.Item
            name="enrolled"
            label="Số lượng đã đăng ký"
            rules={[
              { required: true, message: "Please enter enrolled number" },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="timetable"
            label="Thời khóa biểu"
            rules={[{ required: true, message: "Please enter timetable" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="flex flex-row justify-center">
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
            <Button type="primary" danger htmlType="submit" onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

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
      title: "Số lượng đăng ký",
      dataIndex: "enrolled",
      key: "enrolled",
    },
    {
      title: "Số lượng",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Thời khóa biểu",
      dataIndex: "timetable",
      key: "timetable",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Button onClick={() => showModal(record)}>Chi tiết</Button>
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
              <Form.Item name="faculty" label="Khoa">
                <Input defaultValue={subject.faculty} />
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
            </Form>
          </div>
          <div className="flex justify-end mr-10 mb-20 gap-4">
            <Button type="primary">Lưu thay đổi</Button>
            <Button type="primary" danger>
              Xóa học phần
            </Button>
          </div>
          <div>
            <div className="flex flex-row justify-between items-center mx-10">
              <span className="text-2xl m-12">Danh sách các lớp học phần</span>
              <Button type="primary" onClick={showmodalCreate}>
                Thêm lớp học phần
              </Button>
            </div>
            <Table columns={columns} dataSource={subject.classSections} />
          </div>
        </div>
        {modalCreate()}
        <Modal
          title="Chi tiết lớp học phần"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form}>
            <Form.Item
              name="id"
              label="Mã lớp học phần"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teacher"
              label="Giảng viên"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateRange"
              label="Thời gian"
            >
              <RangePicker />
            </Form.Item>
            <Form.Item
              name="size"
              label="Số lượng"
            >
              <InputNumber min={15} />
            </Form.Item>
            <Form.Item
              name="enrolled"
              label="Số lượng đã đăng ký"
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              name="timetable"
              label="Thời khóa biểu"
            >
              <Input />
            </Form.Item>
            <Form.Item className="flex flex-row justify-center">
              <Button type="primary" onClick={handleOk}>
                Xác nhận
              </Button>
              <Button type="default" onClick={handleCancel}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
