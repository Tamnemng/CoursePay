import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, message, Tabs } from 'antd';
import Header from '../../components/Header';
import { coursesData, generalCourses } from '../../data/coursesData';
import { studentInfo } from '../../data/studentData';
import './Improve.css';

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
        title: 'Action',
        render: (text, record) => (
            <a onClick={() => handleRegisterClick(record)} className="register-link">Đăng Ký Lớp Học</a>
        ),
        className: 'action-column',
    },
];

export default function Improve() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [specializedCourses, setSpecializedCourses] = useState([]);
    const [generalCoursesData, setGeneralCoursesData] = useState([]);
    const [activeTab, setActiveTab] = useState('general');
    useEffect(() => {
        const allSpecializedCourses = coursesData
            .filter(semesterData => semesterData.major === studentInfo.major)
            .flatMap(semesterData =>
                semesterData.courses.map(course => ({
                    ...course,
                    semester: semesterData.semester,
                    major: semesterData.major
                }))
            );
        setSpecializedCourses(allSpecializedCourses);

        const allGeneralCourses = generalCourses
            .flatMap(semesterData =>
                semesterData.courses.map(course => ({
                    ...course,
                    semester: semesterData.semester,
                    major: semesterData.major
                }))
            );
        setGeneralCoursesData(allGeneralCourses);
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

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const classColumns = [
        { title: 'Tên Lớp', dataIndex: 'name', className: 'class-name-column' },
        { title: 'Sĩ Số', dataIndex: 'class_size', className: 'class-size-column' },
        { title: 'Giảng Viên', dataIndex: 'lecturers', className: 'lecturer-column' },
        { title: 'Ngày Bắt Đầu', dataIndex: 'started_day', className: 'start-date-column' },
        { title: 'Ngày Kết Thúc', dataIndex: 'ended_day', className: 'end-date-column' },
        {
            title: 'Action',
            render: (text, record) => <a onClick={() => handleClassRegister(record)} className="register-class-link">Đăng Ký</a>,
            className: 'action-column'
        },
    ];

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1 className='register-title'>Đăng ký môn học</h1>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Môn Học Chung" key="general">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={generalCoursesData}
                            rowKey="id"
                        />
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
                            {selectedCourse && (
                                <Table
                                    columns={classColumns}
                                    dataSource={selectedCourse.classes}
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
                            <p>Bạn có chắc chắn muốn đăng ký lớp {selectedClass?.name} của môn {selectedCourse?.name}?</p>
                        </Modal>
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="specialized">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={specializedCourses}
                            rowKey="id"
                        />
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
                            {selectedCourse && (
                                <Table
                                    columns={classColumns}
                                    dataSource={selectedCourse.classes}
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
                            <p>Bạn có chắc chắn muốn đăng ký lớp {selectedClass?.name} của môn {selectedCourse?.name}?</p>
                        </Modal>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};
