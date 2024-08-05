import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, message, Tabs } from 'antd';
import Header from '../../components/Header';
import { generallSubject, majorSubject } from '../../data/coursesData';
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
        const allSpecializedCourses = majorSubject
            .filter(course => course.semester === studentInfo.semester && course.major === studentInfo.major);
        setSpecializedCourses(allSpecializedCourses);

        const allGeneralCourses = generallSubject
            .filter(course => course.semester === studentInfo.semester);
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
        { title: 'Tên Lớp', dataIndex: 'id', className: 'class-name-column' },
        { title: 'Sĩ Số', dataIndex: 'enrolled', className: 'class-size-column' },
        { title: 'Giảng Viên', dataIndex: 'teacher', className: 'lecturer-column' },
        { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', className: 'start-date-column' },
        { title: 'Ngày Kết Thúc', dataIndex: 'endDate', className: 'end-date-column' },
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
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="specialized">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={specializedCourses}
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
                    {selectedCourse && (
                        <Table
                            columns={classColumns}
                            dataSource={selectedCourse.classSections}
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
};