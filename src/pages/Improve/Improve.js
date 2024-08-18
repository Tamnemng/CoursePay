import React, { useEffect, useState, useCallback } from 'react';
import { Table, Modal, Button, message, Tabs } from 'antd';
import Header from '../../components/Header';
import { getAllGeneralSubjects, getAllStudentSubjects } from '../../data/coursesData';
import { getStudentSemester, updateCoursesList, checkStudentCourses } from '../../data/studentData';
import { updateGeneralClassSection, updateMajorClassSection } from '../../data/subjects';
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

export default function Improve() {
    const [activeTab, setActiveTab] = useState('1');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [generalCourses, setGeneralCourses] = useState([]);
    const [specializedCourses, setSpecializedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRegisterClick = useCallback((course) => {
        setSelectedCourse(course);
        setIsModalVisible(true);
    }, []);

    const handleClassRegister = useCallback((classInfo) => {
        setSelectedClass(classInfo);
        setIsConfirmModalVisible(true);
    }, []);

    const classColumns = [
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const semester = await getStudentSemester();
                const [generalSubjects, studentSubjects] = await Promise.all([
                    getAllGeneralSubjects(),
                    getAllStudentSubjects(),
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

                const processedSpecialized = [
                    ...processSubjects(studentSubjects.major.mandatory, 'mandatory', 'major'),
                    ...processSubjects(studentSubjects.major.elective, 'elective', 'major')
                ];

                setGeneralCourses(processedGeneral);
                setSpecializedCourses(processedSpecialized);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load courses. Please try again later.');
            } finally {
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

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleConfirmRegister = async () => {
        if (selectedCourse && selectedClass) {
            try {
                const isAlreadyRegistered = await checkStudentCourses(selectedClass.id);
                if (isAlreadyRegistered) {
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

                const changeClass = {
                    id: selectedClass.id,
                    originalId: selectedClass.id,
                    teacher: selectedClass.teacher,
                    startDate: selectedClass.startDate,
                    endDate: selectedClass.endDate,
                    size: selectedClass.size,
                    enrolled: selectedClass.enrolled + 1,
                    timetable: selectedClass.timetable,
                };

                // Update the class section based on the active tab
                if (activeTab === '1') {
                    // General subjects tab
                    await updateGeneralClassSection(selectedCourse.id, changeClass);
                } else {
                    // Specialized subjects tab
                    await updateMajorClassSection(selectedCourse.id, changeClass);
                }

                await updateCoursesList(courseData);
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

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1 className='register-title'>Đăng ký môn học</h1>
                <Tabs defaultActiveKey="1" onChange={(key) => setActiveTab(key)}>
                    <TabPane tab="Môn Học Chung" key="1">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={generalCourses}
                            rowKey="id"
                            loading={loading}
                        />
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="2">
                        <Table
                            columns={columns(handleRegisterClick)}
                            dataSource={specializedCourses}
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