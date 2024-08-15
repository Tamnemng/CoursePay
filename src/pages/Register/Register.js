import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, message, Spin, Tabs } from 'antd';
import Header from '../../components/Header';
import { getGeneralSubjects } from '../../data/coursesData';
import { updateCoursesList, getStudentCourses } from '../../data/studentData';
import './Register.css';
const { TabPane } = Tabs;

const columns = (handleRegisterClick) => [
    {
        title: 'Tên Học Phần',
        dataIndex: 'name',
        className: 'course-name-column',
    },
    {
        title: 'Mã Học Phần',
        dataIndex: 'id',
        className: 'course-id-column',
    },
    {
        title: 'Số tín chỉ',
        dataIndex: 'credits',
        className: 'course-credits-column',
    },
    {
        title: 'Đăng Ký Môn Học',
        render: (text, record) => (
            <a onClick={() => handleRegisterClick(record)} className="register-link">Đăng Ký Lớp Học</a>
        ),
        className: 'action-column',
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
    const [registeredCourses, setRegisteredCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const generalSubjects = await getGeneralSubjects();
                if (!generalSubjects) {
                    throw new Error('Failed to fetch general subjects');
                }
                const { mandatory, elective } = generalSubjects;

                const processedMandatory = Object.entries(mandatory)
                    .map(([id, course]) => ({
                        id,
                        ...course,
                    }));
                setMandatoryCourses(processedMandatory);

                const processedElective = Object.entries(elective)
                    .map(([id, course]) => ({
                        id,
                        ...course,
                    }));
                setElectiveCourses(processedElective);

                const studentCourses = await getStudentCourses();
                setRegisteredCourses(studentCourses || []);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load courses. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleRegisterClick = (course) => {
        setSelectedCourse(course);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleClassRegister = (classInfo) => {
        if (classInfo.enrolled < classInfo.size) {
            setSelectedClass(classInfo);
            setIsConfirmModalVisible(true);
        } else {
            message.error('Lớp học đã đầy. Không thể đăng ký.');
        }
    };

    const handleConfirmRegister = async () => {
        if (selectedCourse && selectedClass) {
            try {
                if (registeredCourses[selectedCourse.id]) {
                    message.error('Bạn đã đăng ký khóa học này rồi!');
                    return;
                }

                const courseData = {
                    id: selectedClass.id,
                    credits: selectedCourse.credits,
                    name: selectedCourse.name,
                    teacher: selectedClass.teacher,
                    timeEnd: selectedClass.endDate,
                    timeStart: selectedClass.startDate,
                    timetable: selectedClass.timetable
                };

                await updateCoursesList(courseData);

                setRegisteredCourses(prev => ({
                    ...prev,
                    [selectedCourse.id]: courseData
                }));

                message.success('Đăng ký khóa học thành công!');
                setIsConfirmModalVisible(false);
                setIsModalVisible(false);
            } catch (error) {
                console.error('Error registering course:', error);
                message.error('Không thể đăng ký khóa học. Vui lòng thử lại.');
            }
        } else {
            message.error('Không thể đăng ký khóa học. Vui lòng thử lại.');
        }
    };

    const handleCancelRegister = () => {
        setIsConfirmModalVisible(false);
    };

    const classColumns = [
        { title: 'Mã Lớp', dataIndex: 'id', className: 'class-id-column' },
        {
            title: 'Sĩ Số',
            dataIndex: 'enrolled',
            className: 'class-size-column',
            render: (enrolled, record) => `${enrolled}/${record.size}`
        },
        { title: 'Giảng Viên', dataIndex: 'teacher', className: 'lecturer-column' },
        { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', className: 'start-date-column' },
        { title: 'Ngày Kết Thúc', dataIndex: 'endDate', className: 'end-date-column' },
        { title: "Thời Khóa Biểu", dataIndex: 'timetable', className: 'info-column' },
        {
            title: 'Đăng Ký',
            render: (text, record) => (
                <Button
                    onClick={() => handleClassRegister(record)}
                    disabled={record.enrolled >= record.size}
                    className="register-class-button"
                >
                    {record.enrolled >= record.size ? 'Đã đầy' : 'Đăng Ký'}
                </Button>
            ),
            className: 'action-column'
        },
    ];

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1 className='register-title'>Đăng ký môn chung</h1>
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
                    title={<h2 className="modal-title">Danh sách lớp học - {selectedCourse?.name}</h2>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width="80%"
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            Đóng
                        </Button>
                    ]}
                >
                    {selectedCourse && selectedCourse.classSections && (
                        <Table
                            columns={classColumns}
                            dataSource={Object.entries(selectedCourse.classSections).map(([id, section]) => ({
                                id,
                                ...section
                            }))}
                            loading={loading}
                            rowKey="id"
                        />
                    )}
                </Modal>
                <Modal
                    title="Xác nhận đăng ký"
                    visible={isConfirmModalVisible}
                    onOk={handleConfirmRegister}
                    onCancel={handleCancelRegister}
                >
                    <p>Bạn có chắc chắn muốn đăng ký lớp {selectedClass?.id} của môn {selectedCourse?.name}?</p>
                </Modal>
            </div>
        </div>
    );
}