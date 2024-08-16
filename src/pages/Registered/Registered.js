import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import { Table } from 'antd';
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

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const coursesData = await getStudentCourses();
            if (coursesData) {
                const processedCourses = Object.entries(coursesData).map(([id, course]) => ({
                    key: id,
                    ...course
                }));
                setCourses(processedCourses);
            } else {
                setCourses([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                        rowKey="key"
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}