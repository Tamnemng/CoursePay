import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import './Registered.css';

const studentRegisteredCoursesInfo = [
    { id: 1, name: "Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10'},
    { id: 2, name: "Course 2", courseCredits: 3, timeStart: '2024-08-10', timeEnd: '2024-11-10'},
    { id: 3, name: "Course 3", courseCredits: 1, timeStart: '2024-08-10', timeEnd: '2024-11-10'},
];

const columns = [
    {
        title: 'Tên Môn Học',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Tín Chỉ',
        dataIndex: 'courseCredits',
        key: 'courseCredits',
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
];

export default function Registered() {
    const [filteredCourses, setFilteredCourses] = useState(studentRegisteredCoursesInfo);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        filterCourses();
    }, [dateRange]);

    const filterCourses = () => {
        const [start, end] = dateRange;
        if (start && end) {
            const filtered = studentRegisteredCoursesInfo.filter(course => {
                const courseStart = moment(course.timeStart);
                const courseEnd = moment(course.timeEnd);
                return (courseStart.isSameOrAfter(start, 'day') && courseStart.isSameOrBefore(end, 'day')) ||
                       (courseEnd.isSameOrAfter(start, 'day') && courseEnd.isSameOrBefore(end, 'day')) ||
                       (courseStart.isBefore(start, 'day') && courseEnd.isAfter(end, 'day'));
            });
            setFilteredCourses(filtered);
        } else {
            setFilteredCourses(studentRegisteredCoursesInfo);
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleResetFilter = () => {
        setDateRange([null, null]);
        setFilteredCourses(studentRegisteredCoursesInfo);
    };

    return (
        <div className='registered-container'>
            <Header />
            <div className='registered'>
                <h1>Các Khóa Học Đã Đăng Ký</h1>
                <div className='table-container'>
                    <Table 
                        className='displayer' 
                        dataSource={filteredCourses} 
                        columns={columns} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>
        </div>
    );
}