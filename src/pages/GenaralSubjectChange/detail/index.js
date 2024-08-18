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
  Spin,
  Tabs,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  getGeneralClassSectionLength,
  getGeneralSubjectDetail,
  addGeneralClassSection,
  updateGeneralClassSection,
  deleteGeneralClassSection,
  updateGeneralSubject,
  deleteGeneralSubject,
} from "../../../data/subjects";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

export default function MajorSubjectChangeDetail() {
  const { id } = useParams();
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();
  const [classDetailForm] = Form.useForm();
  const [createClassForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [subject, setSubject] = useState(null);
  const [classSection, setClassSection] = useState(null);
  const { confirm } = Modal;

  useEffect(() => {
    getGeneralSubjectDetail(id).then((result) => {
      if (result.status === "success") {
        const data = result.data;
        const classSections = Array.isArray(data.classSections)
          ? data.classSections
          : Object.values(data.classSections || {});

        setSubject({ ...data, classSections });
        classDetailForm.setFieldsValue({
          id: data.id,
          name: data.name,
          faculty: data.faculty,
          semester: data.semester,
          credits: data.credits,
          type: data.type,
        });
      } else {
        console.error(result.message);
      }
    });
  }, [id, classDetailForm]);

  useEffect(() => {
    if (classSection) {
      classDetailForm.setFieldsValue({
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
  }, [classSection, classDetailForm]);

  const showModal = (classSection) => {
    setClassSection(classSection);
    setIsModalOpen(true);
  };

  const onChange = (key) => {
    console.log(key);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalCreateOpen(false);
  };

  const showModalCreate = async () => {
    const newId = await getNewClassSectionId();
    createClassForm.setFieldsValue({ id: newId });
    setIsModalCreateOpen(true);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn chắc chắn muốn xóa học phần này ?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteSubject(subject.id);
      },
      onCancel() {},
    });
  };

  const getNewClassSectionId = async () => {
    const subjectCode = subject.id;
    const semesterCode = subject.semester.slice(-1);
    const classLength = (await getGeneralClassSectionLength(subject.id)) + 1;
    return `${subjectCode}0${semesterCode}0${classLength}`;
  };

  const handleCreateClassSection = async () => {
    try {
      const values = await createClassForm.validateFields();
      const classSectionData = {
        classId: values.id,
        teacher: values.teacher,
        startDate: values.dateRange[0].format("YYYY-MM-DD"),
        endDate: values.dateRange[1].format("YYYY-MM-DD"),
        size: values.size,
        enrolled: values.enrolled,
        timetable: values.timetable,
      };

      const result = await addGeneralClassSection(subject.id, classSectionData);

      if (result.status === "success") {
        getGeneralSubjectDetail(subject.id).then((result) => {
          if (result.status === "success") {
            const data = result.data;
            const classSections = Array.isArray(data.classSections)
              ? data.classSections
              : Object.values(data.classSections || {});
            setSubject({ ...data, classSections });
            message.success("Thêm lớp học phần thành công.");
            createClassForm.resetFields();
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
      const values = await classDetailForm.validateFields();
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

      const result = await updateGeneralClassSection(
        subject.id,
        updatedClassSection
      );

      if (result.status === "success") {
        setIsModalOpen(false);
        message.success("Cập nhật lớp học phần thành công.");

        const updatedSubjectDetail = await getGeneralSubjectDetail(subject.id);
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
      const result = await deleteGeneralClassSection(
        subject.id,
        classSectionId
      );

      if (result.status === "success") {
        console.log(result.message);
        setIsModalOpen(false);

        const updatedSubjectDetail = await getGeneralSubjectDetail(subject.id);
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

  const handleUpdateSubject = async () => {
    try {
      const values = await detailForm.validateFields();
      const updatedClassSection = {
        id: values.id,
        name: values.name,
        faculty: values.faculty,
        semester: values.semester,
        credits: values.credits,
        type: values.type,
      };

      const result = await updateGeneralSubject(
        subject.id,
        updatedClassSection
      );

      if (result.status === "success") {
        console.log(Object.keys(result));
        setIsModalOpen(false);
        message.success("Cập nhật học phần thành công.");
        // navigate("/generalSubjectChange");
      } else if (result.status === "exists") {
        message.error("Mã lớp phần đã tồn tại.");
      } else {
        message.error("Cập nhật học phần thất bại.");
      }
    } catch (error) {
      message.error("Cập nhật học phần thất bại.");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      const result = await deleteGeneralSubject(subjectId);

      if (result.status === "success") {
        console.log(result.message);
        message.success("Xóa học phần thành công.");
        navigate("/generalSubjectChange");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      message.error("Xóa học phần thất bại.");
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
          form={createClassForm}
          onFinish={handleCreateClassSection}
          initialValues={{ enrolled: 0 }}
        >
          <Form.Item
            name="id"
            label="Mã lớp học phần"
            rules={[{ required: true, message: "Please enter class ID" }]}
          >
            <Input className="font-bold" disabled />
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
            <InputNumber min={15} max={150} />
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
            <InputNumber disabled min={0} />
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
      <div className="flex h-screen w-full">
        <Header />
        <div className="flex h-full w-full justify-center items-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
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
            title="Xóa lớp học phần"
            description="Bạn chắc chắn muốn xóa lớp học phần này?"
            icon={<QuestionCircleOutlined />}
            okText="Xóa"
            okType="danger"
            cancelText="Hủy"
            onConfirm={() => handleDeleteClassSection(record.id)}
          >
            <DeleteOutlined className="text-red-600 transition-all cursor-pointer" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Thông tin học phần",
      children: (
        <div>
          <div className="flex justify-end mr-10 mb-20 gap-4">
            <Button type="primary" onClick={() => navigate(-1)}>
              <ArrowLeftOutlined /> Trở về
            </Button>
          </div>
          <div className="m-20 mx-96">
            <Form
              name="subjectDetail"
              form={detailForm}
              initialValues={subject}
            >
              <Form.Item name="id" label="Mã học phần">
                <Input className="font-bold" disabled />
              </Form.Item>
              <Form.Item name="name" label="Tên học phần">
                <Input />
              </Form.Item>
              <Form.Item name="faculty" label="Khoa">
                <Input />
              </Form.Item>
              <div className="flex flex-row gap-8">
                <Form.Item name="semester" label="Học kỳ">
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
                <Form.Item name="credits" label="Số tín chỉ">
                  <InputNumber min={1} max={8} />
                </Form.Item>
              </div>
              <Form.Item name="type" label="Loại học phần">
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
              <div className="flex justify-center m-4">
                <Form.Item>
                  <div className="flex justify-end mr-10 mb-20 gap-4">
                    <Button type="primary" onClick={handleUpdateSubject}>
                      <EditOutlined /> Cập nhật
                    </Button>
                    <Button type="primary" danger onClick={showDeleteConfirm}>
                      <DeleteOutlined /> Xóa học phần
                    </Button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Danh sách các lớp học phần",
      children: (
        <div>
          <div>
            <div className="flex flex-row justify-end m-4 items-center mx-10">
              <Button type="primary" onClick={showModalCreate}>
                <PlusOutlined /> Thêm lớp học phần
              </Button>
            </div>
            <Table columns={columns} dataSource={subject.classSections} />
          </div>
          {modalCreate()}
          <Modal
            title="Chi tiết lớp học phần"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form name="classDetail" form={classDetailForm}>
              <Form.Item
                name="id"
                label="Mã lớp học phần"
                rules={[{ required: true, message: "Please enter class ID" }]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="teacher"
                label="Giảng viên"
                rules={[
                  { required: true, message: "Please enter teacher name" },
                ]}
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
      ),
    },
  ];

  return (
    <div className="flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
