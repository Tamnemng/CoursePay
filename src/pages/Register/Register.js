import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Modal, Button, message } from 'antd';
import Header from '../../components/Header';
import { coursesData } from '../../data/coursesData';
import './Register.css';

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

export default function Register() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setData(coursesData);
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
                <h1 className='register-title'>Đăng ký môn chung</h1>
                <Button onClick={() => {
                    setData([...data, {
                        ...data.at(-1),
                        key: data.length + 1
                    }]);
                }}>
                    {data.map((v) => v.key).join(" ")}
                </Button>
                <div className='table-container'>
                    <Table
                        className='course-table'
                        columns={columns(handleRegisterClick)}
                        dataSource={data}
                    />
                </div>
                <Modal
                    title={<h2 className="modal-title">Danh sách lớp học - {selectedCourse?.name}</h2>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    className="class-list-modal"
                    width="80%"
                    footer={[
                        <Button key="back" onClick={handleCancel} className="modal-cancel-btn">
                            Đóng
                        </Button>
                    ]}
                >
                    {selectedCourse && (
                        <Table
                            className='class-table'
                            columns={classColumns}
                            dataSource={selectedCourse.classes}
                            scroll={{ y: 400 }}
                            rowClassName={(record) => record.class_size >= 50 ? 'full-class-row' : ''}
                        />
                    )}
                </Modal>
                <Modal
                    title="Xác nhận đăng ký"
                    visible={isConfirmModalVisible}
                    onOk={handleConfirmRegister}
                    onCancel={handleCancelRegister}
                    className="confirm-modal"
                >
                    <p>Bạn có chắc chắn muốn đăng ký lớp {selectedClass?.name} của môn {selectedCourse?.name}?</p>
                </Modal>
            </div>
        </div>
    );
}