import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Modal, Button, message, Tabs, Spin } from 'antd';
import Header from '../../components/Header';
import { getAllGeneralSubjects, getAllStudentSubjects } from '../../data/coursesData';
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
        title: 'Số tín chỉ',
        dataIndex: 'credits',
        className: 'course-credits-column',
    },
    {
        title: 'Chọn Môn Đăng Ký',
        render: (_, record) => (
            <a onClick={() => handleRegisterClick(record)} className="register-link">Đăng Ký Lớp Học</a>
        ),
        className: 'action-column',
    },
];

const classColumns = (handleClassRegister) => [
    { title: 'Tên Lớp', dataIndex: 'id', className: 'class-name-column' },
    { title: 'Sĩ Số', dataIndex: 'enrolled', className: 'class-size-column' },
    { title: 'Giảng Viên', dataIndex: 'teacher', className: 'lecturer-column' },
    { title: 'Ngày Bắt Đầu', dataIndex: 'startDate', className: 'start-date-column' },
    { title: 'Ngày Kết Thúc', dataIndex: 'endDate', className: 'end-date-column' },
    { title: "Thời Khóa Biểu", dataIndex: 'timetable', className: 'info-column' },
    {
        title: 'Chọn Lớp Đăng Ký',
        render: (_, record) => <a onClick={() => handleClassRegister(record)} className="register-class-link">Đăng Ký</a>,
        className: 'action-column'
    },
];

export default function Improve() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [courses, setCourses] = useState({ general: [], specialized: [] });
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [generalSubjects, studentSubjects] = await Promise.all([
                    getAllGeneralSubjects(),
                    getAllStudentSubjects()
                ]);

                if (!generalSubjects || !studentSubjects) {
                    throw new Error('Failed to fetch subjects data');
                }

                const processedGeneral = Object.entries(generalSubjects).flatMap(([semester, subjects]) =>
                    Object.entries(subjects).map(([id, course]) => ({
                        id,
                        semester,
                        ...course,
                    }))
                );

                const specializedSubjects = [
                    ...processSubjects(studentSubjects.faculty.mandatory, 'mandatory', 'faculty'),
                    ...processSubjects(studentSubjects.faculty.elective, 'elective', 'faculty'),
                    ...processSubjects(studentSubjects.major.mandatory, 'mandatory', 'major'),
                    ...processSubjects(studentSubjects.major.elective, 'elective', 'major')
                ];

                setCourses({
                    general: processedGeneral,
                    specialized: specializedSubjects
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load courses. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processSubjects = (subjects, type, category) =>
        Object.entries(subjects).map(([id, course]) => ({
            id,
            type,
            category,
            ...course,
        }));

    const handleRegisterClick = useCallback((course) => {
        setSelectedCourse(course);
        setIsModalVisible(true);
    }, []);

    const handleOk = useCallback(() => setIsModalVisible(false), []);
    const handleCancel = useCallback(() => setIsModalVisible(false), []);

    const handleClassRegister = useCallback((classInfo) => {
        setSelectedClass(classInfo);
        setIsConfirmModalVisible(true);
    }, []);

    const handleConfirmRegister = useCallback(() => {
        message.success('Đăng ký thành công!');
        setIsConfirmModalVisible(false);
        setIsModalVisible(false);
    }, []);

    const handleCancelRegister = useCallback(() => setIsConfirmModalVisible(false), []);
    const handleTabChange = useCallback((key) => setActiveTab(key), []);

    const memoizedColumns = useMemo(() => columns(handleRegisterClick), [handleRegisterClick]);
    const memoizedClassColumns = useMemo(() => classColumns(handleClassRegister), [handleClassRegister]);

    if (loading) return <Spin size="large" />;
    if (error) return <div>{error}</div>;

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1 className='register-title'>Đăng ký môn học</h1>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Môn Học Chung" key="general">
                        <Table columns={memoizedColumns} dataSource={courses.general} rowKey="id" />
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="specialized">
                        <Table columns={memoizedColumns} dataSource={courses.specialized} rowKey="id" />
                    </TabPane>
                </Tabs>
                <Modal
                    title={<h2 className="modal-title">Danh sách lớp học - {selectedCourse?.name}</h2>}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width="80%"
                    footer={[<Button key="back" onClick={handleCancel}>Đóng</Button>]}
                >
                    {selectedCourse && selectedCourse.classSections && (
                        <Table
                            columns={memoizedClassColumns}
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