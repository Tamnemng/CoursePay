import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, Modal, Button, message, Tabs, Spin } from 'antd';
import Header from '../../components/Header';
import { getStudentCourses, updateCoursesList } from '../../data/studentData';
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

export default function Improve() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [courses, setCourses] = useState({ general: [], specialized: [] });
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registeredCourses, setRegisteredCourses] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [generalSubjects, studentSubjects, studentCourses] = await Promise.all([
                    getAllGeneralSubjects(),
                    getAllStudentSubjects(),
                    getStudentCourses()
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
                    ...processSubjects(studentSubjects.major.mandatory, 'mandatory', 'major'),
                    ...processSubjects(studentSubjects.major.elective, 'elective', 'major')
                ];

                setCourses({
                    general: processedGeneral,
                    specialized: specializedSubjects
                });
                setRegisteredCourses(studentCourses || {});
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

    const handleConfirmRegister = async () => {
        if (selectedCourse && selectedClass) {
            try {
                // Check if the course is already registered
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

    const memoizedColumns = useMemo(() => columns(handleRegisterClick, registeredCourses), [handleRegisterClick, registeredCourses]);

    const handleCancelRegister = useCallback(() => setIsConfirmModalVisible(false), []);
    const handleTabChange = useCallback((key) => setActiveTab(key), []);

    const memoizedClassColumns = useMemo(() => classColumns(handleClassRegister), [handleClassRegister]);

    if (error) return <div>{error}</div>;

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1 className='register-title'>Đăng ký môn học</h1>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Môn Học Chung" key="general">
                        <Table columns={memoizedColumns} dataSource={courses.general} rowKey="id" loading={loading} />
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="specialized">
                        <Table columns={memoizedColumns} dataSource={courses.specialized} rowKey="id" loading={loading} />
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
                            loading={loading}
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