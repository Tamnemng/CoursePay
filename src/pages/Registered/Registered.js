import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Table, Spin } from 'antd';
import moment from 'moment';
import './Registered.css';
import { getStudentCourses } from '../../data/studentData';

const columns = [
    {
        title: 'Tên Môn Học',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Tín Chỉ',
        dataIndex: 'credits',
        key: 'credits',
    },
    {
        title: 'Ngày Bắt Đầu',
        dataIndex: 'timeStart',
        key: 'timeStart',
        render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
        title: 'Ngày Kết Thúc',
        dataIndex: 'timeEnd',
        key: 'timeEnd',
        render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
        title: 'Giảng viên',
        dataIndex: 'teacher',
        key: 'teacher',
    },
    {
        title: 'Lịch học',
        dataIndex: 'timetable',
        key: 'timetable',
    },
];

export default function Registered() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesData = await getStudentCourses();
                if (coursesData) {
                    const processedCourses = Object.entries(coursesData).map(([id, course]) => ({
                        key: id,
                        ...course
                    }));
                    setCourses(processedCourses);
                } else {
                    setError('No courses found.');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load courses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div className='registered-container'>
            <Header />
            <div className='registered'>
                <h1>Các Học Phần Đã Đăng Ký</h1>
                <div className='table-container'>
                    <Table
                        className='displayer'
                        dataSource={courses}
                        columns={columns}
                        rowKey="id"
                    />
                </div>
            </div>
        </div>
    );
}