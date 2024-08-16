import React, { useEffect, useState } from "react";
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
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  addMajorClassSection,
  updateMajorClassSection,
  deleteMajorClassSection,
  getMajorSubjectDetail,
} from "../../../data/subjects";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function MajorSubjectChangeDetail() {
  const { id } = useParams();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

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
        dateRange: [
          moment(classSection.startDate),
          moment(classSection.endDate),
        ],
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

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalCreateOpen(false);
  };

  const showModalCreate = () => {
    setIsModalCreateOpen(true);
  };

  const handleCreateClassSection = async () => {
    try {
      const values = await createForm.validateFields();
      const classSectionData = {
        classId: values.id,
        teacher: values.teacher,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        size: values.size,
        enrolled: values.enrolled,
        timetable: values.timetable,
      };

      const result = await addMajorClassSection(subject.id, classSectionData);

      if (result.status === "success") {
        getMajorSubjectDetail(subject.id).then((result) => {
          if (result.status === "success") {
            const data = result.data;
            const classSections = Array.isArray(data.classSections)
              ? data.classSections
              : Object.values(data.classSections || {});
            setSubject({ ...data, classSections });
            message.success("Thêm lớp học phần thành công.");
            createForm.resetFields();
          } else {
            console.error(result.message);
          }
        });

        setIsModalCreateOpen(false);
      } else {
        message.error("Mã lớp học phần đã tồn tại.");
      }
    } catch (error) {
      message.error("Thêm lớp học phần thất bại.");
    }
  };

  const handleUpdateClassSection = async () => {
    try {
      const values = await form.validateFields();
      const updatedClassSection = {
        id: values.id,
        originalId: classSection.id,
        teacher: values.teacher,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        size: values.size,
        enrolled: values.enrolled,
        timetable: values.timetable,
      };

      const result = await updateMajorClassSection(subject.id, updatedClassSection);

      if (result.status === "success") {
        setIsModalOpen(false);
        message.success("Cập nhật lớp học phần thành công.");

        const updatedSubjectDetail = await getMajorSubjectDetail(subject.id);
        if (updatedSubjectDetail.status === "success") {
          setSubject(updatedSubjectDetail.data);
        } else {
          console.error(updatedSubjectDetail.message);
        }
      } else {
        message.error("Mã lớp học phần đã tồn tại.");
      }
    } catch (error) {
      message.error("Cập nhật lớp học phần thất bại.");
    }
  };

  const handleDeleteClassSection = async (classSectionId) => {
    try {
      const result = await deleteMajorClassSection(subject.id, classSectionId);

      if (result.status === "success") {
        console.log(result.message);
        setIsModalOpen(false);

        const updatedSubjectDetail = await getMajorSubjectDetail(subject.id);
        if (updatedSubjectDetail.status === "success") {
          setSubject(updatedSubjectDetail.data);
          message.success("Xóa lớp học phần thành công.");
        } else {
          console.error(updatedSubjectDetail.message);
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      message.error("Xóa lớp học phần thất bại.");
    }
  };

  const modalCreate = () => {
    return (
      <Modal
        title="Thêm lớp học phần"
        open={isModalCreateOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="createForm"
          form={createForm}
          onFinish={handleCreateClassSection}
        >
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
              {
                required: true,
                message: "Please enter enrolled number",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value <= getFieldValue("size")) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Enrolled must be less than or equal to class size"
                    )
                  );
                },
              }),
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
          <Form.Item>
            <div className="flex flex-row justify-center gap-4">
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
              <Button type="default" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
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
            Không tìm thấy thông tin học phần.
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
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-500 transition-all cursor-pointer"
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="Xóa học phần"
            description="Bạn chắc chắn muốn xóa học phần này?"
            icon={<QuestionCircleOutlined />}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteClassSection(record.id)}
          >
            <DeleteOutlined className="text-red-600 transition-all cursor-pointer" />
          </Popconfirm>
        </div>
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
            <Form name="subjectDetail" form={form}>
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
              <Button type="primary" onClick={showModalCreate}>
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
          <Form name="classDetail" form={form}>
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
              rules={[{ required: true, message: "Please enter date range" }]}
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
                {
                  required: true,
                  message: "Please enter enrolled number",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value <= getFieldValue("size")) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Enrolled must be less than or equal to class size"
                      )
                    );
                  },
                }),
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
            <Form.Item>
              <div className="flex flex-row justify-center gap-4">
                <Button type="primary" onClick={handleUpdateClassSection}>
                  Cập nhật
                </Button>
                <Button type="default" onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
