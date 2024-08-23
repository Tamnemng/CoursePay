import { Button, message, Modal, Table, Tabs } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import { getGeneralSubjects } from "../../data/coursesData";
import {
  checkStudentCourses,
  updateCoursesList,
  deleteRegisteredCourse,
} from "../../data/studentData";
import { increaseGeneralEnrolled, decreaseEnrolled } from "../../data/subjects";
import Nav from "../../components/Nav";
import "./Register.css";

const { TabPane } = Tabs;

const columns = (handleRegisterClick) => [
  {
    title: "Tên Học Phần",
    dataIndex: "name",
    className: "course-name-column",
  },
  {
    title: "Mã Học Phần",
    dataIndex: "id",
    className: "course-id-column",
  },
  {
    title: "Số tín chỉ",
    dataIndex: "credits",
    className: "course-credits-column",
  },
  {
    title: "Đăng Ký Môn Học",
    render: (_, record) => (
      <a onClick={() => handleRegisterClick(record)} className="register-link">
        Đăng Ký Lớp Học
      </a>
    ),
    className: "action-column",
  },
];

export default function Register() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [mandatoryCourses, setMandatoryCourses] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const generalSubjects = await getGeneralSubjects();
      if (!generalSubjects) {
        throw new Error("Failed to fetch general subjects");
      }
      const { mandatory, elective } = generalSubjects;

      const processedMandatory = Object.entries(mandatory).map(
        ([id, course]) => ({
          id,
          ...course,
        })
      );
      setMandatoryCourses(processedMandatory);

      const processedElective = Object.entries(elective).map(
        ([id, course]) => ({
          id,
          ...course,
        })
      );
      setElectiveCourses(processedElective);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load courses. Please try again later.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleClassRegister = (classInfo) => {
    if (classInfo.enrolled < classInfo.size) {
      setSelectedClass(classInfo);
      setIsConfirmModalVisible(true);
    } else {
      message.error("Lớp học đã đầy. Không thể đăng ký.");
    }
  };

  const handleConfirmRegister = async () => {
    if (!selectedCourse || !selectedClass) {
      message.error("Không thể đăng ký khóa học. Vui lòng thử lại.");
      return;
    }

    try {
      const isAlreadyRegistered = await checkStudentCourses(selectedClass.id);
      if (isAlreadyRegistered) {
        message.error("Bạn đã đăng ký lớp học này rồi!");
        return;
      }

      const registeredClasses = Object.keys(selectedCourse.classSections);
      for (const classId of registeredClasses) {
        if (classId !== selectedClass.id) {
          const isRegisteredForOtherClass = await checkStudentCourses(classId);
          if (isRegisteredForOtherClass) {
            Modal.confirm({
              title: "Thay thế đăng ký hiện tại",
              content: `Bạn đã đăng ký lớp ${classId} cho môn học này. Bạn có muốn hủy đăng ký lớp cũ và đăng ký lớp mới không?`,
              onOk: async () => {
                await deleteRegisteredCourse(classId);
                await decreaseEnrolled(classId);
                await registerNewCourse();
              },
              onCancel: () => {
                message.info("Đăng ký mới đã bị hủy.");
              },
            });
            return;
          }
        }
      }

      await registerNewCourse();
    } catch (error) {
      console.error("Error checking or registering course:", error);
      message.error("Không thể đăng ký khóa học. Vui lòng thử lại.");
    }
  };

  const registerNewCourse = async () => {
    try {
      const courseData = {
        id: selectedClass.id,
        credits: selectedCourse.credits,
        name: selectedCourse.name,
        teacher: selectedClass.teacher,
        timeEnd: selectedClass.endDate,
        timeStart: selectedClass.startDate,
        timetable: selectedClass.timetable,
      };

      await increaseGeneralEnrolled(selectedCourse.id, selectedClass.id);
      await updateCoursesList(courseData);
      message.success("Đăng ký khóa học thành công!");
      setIsConfirmModalVisible(false);
      setIsModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error("Error registering new course:", error);
      message.error("Không thể đăng ký khóa học mới. Vui lòng thử lại.");
    }
  };

  const classColumns = [
    { title: "Mã Lớp", dataIndex: "id", className: "class-id-column" },
    {
      title: "Sĩ Số",
      dataIndex: "enrolled",
      className: "class-size-column",
      render: (enrolled, record) => `${enrolled}/${record.size}`,
    },
    { title: "Giảng Viên", dataIndex: "teacher", className: "lecturer-column" },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      className: "start-date-column",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      className: "end-date-column",
    },
    {
      title: "Thời Khóa Biểu",
      dataIndex: "timetable",
      className: "info-column",
    },
    {
      title: "Đăng Ký",
      render: (_, record) => (
        <Button
          onClick={() => handleClassRegister(record)}
          disabled={record.enrolled >= record.size}
          className="register-class-button"
        >
          {record.enrolled >= record.size ? "Đã đầy" : "Đăng Ký"}
        </Button>
      ),
      className: "action-column",
    },
  ];

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="register-container !flex !flex-col">
        <Nav/>
      <div className="!flex">
        <Header />
        <div className="register">
          <h1 className="register-title">Đăng ký môn chung</h1>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Môn Bắt Buộc" key="1">
              <Table
                columns={columns(handleRegisterClick)}
                dataSource={mandatoryCourses}
                rowKey="id"
                loading={loading}
              />
            </TabPane>
            <TabPane tab="Môn Tự Chọn" key="2">
              <Table
                columns={columns(handleRegisterClick)}
                dataSource={electiveCourses}
                rowKey="id"
                loading={loading}
              />
            </TabPane>
          </Tabs>
          <Modal
            title={
              <h2 className="modal-title">
                Danh sách lớp học - {selectedCourse?.name}
              </h2>
            }
            visible={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
            width="80%"
            footer={[
              <Button key="back" onClick={() => setIsModalVisible(false)}>
                Đóng
              </Button>,
            ]}
          >
            {selectedCourse && selectedCourse.classSections && (
              <Table
                columns={classColumns}
                dataSource={Object.entries(selectedCourse.classSections).map(
                  ([id, section]) => ({
                    id,
                    ...section,
                  })
                )}
                loading={loading}
                rowKey="id"
              />
            )}
          </Modal>
          <Modal
            title="Xác nhận đăng ký"
            visible={isConfirmModalVisible}
            onOk={handleConfirmRegister}
            onCancel={() => setIsConfirmModalVisible(false)}
          >
            <p>
              Bạn có chắc chắn muốn đăng ký lớp {selectedClass?.id} của môn{" "}
              {selectedCourse?.name}?
            </p>
          </Modal>
        </div>
      </div>
    </div>
  );
}
