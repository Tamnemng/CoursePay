import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import './Registered.css';
import { studentInfo } from '../../data/studentData';

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
    const [courses] = useState(studentInfo.registeredCourses);

    return (
        <div className='registered-container'>
            <Header />
            <div className='registered'>
                <h1>Các Khóa Học Đã Đăng Ký</h1>
                <div className='table-container'>
                    <Table 
                        className='displayer' 
                        dataSource={courses} 
                        columns={columns} 
                        rowKey="id" 
                        pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>
        </div>
    );
}