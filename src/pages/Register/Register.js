import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, message, Spin, Tabs } from 'antd';
import Header from '../../components/Header';
import { getGeneralSubjects } from '../../data/coursesData';
import { studentInfo } from '../../data/studentData';
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
        setSelectedClass(classInfo);
        setIsConfirmModalVisible(true);
    };

    const handleConfirmRegister = () => {
        message.success('Đăng ký thành công!');
        setIsConfirmModalVisible(false);
        setIsModalVisible(false);
    };

    const handleCancelRegister = () => {
        setIsConfirmModalVisible(false);
    };

    const classColumns = [
        { title: 'Tên Lớp', dataIndex: 'id', className: 'class-name-column' },
        { title: 'Sĩ Số', dataIndex: 'enrolled', className: 'class-size-column' },
        { title: 'Giảng Viên', dataIndex: 'teacher', className: 'lecturer-column' },
        { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', className: 'start-date-column' },
        { title: 'Ngày Kết Thúc', dataIndex: 'endDate', className: 'end-date-column' },
        { title: "Thời Khóa Biểu", dataIndex: 'timetable', className: 'info-column'},
        {
            title: 'Đăng Ký',
            render: (text, record) => <a onClick={() => handleClassRegister(record)} className="register-class-link">Đăng Ký</a>,
            className: 'action-column'
        },
    ];

    if (loading) {
        return <Spin size="large" />;
    }

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
                        />
                    </TabPane>
                    <TabPane tab="Môn Tự Chọn" key="2">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={electiveCourses}
                            rowKey="id"
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