import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Table, DatePicker, Tabs } from 'antd';
import moment from 'moment';
import './Available.css';

const { TabPane } = Tabs;

const availableCoursesInfo = {
    general: [
        { id: 1, name: "General Course 1", courseCredits: 2, timeStart: '2024-08-10', timeEnd: '2024-11-10', maxStudents: 50, currentStudents: 30 },
        { id: 2, name: "General Course 2", courseCredits: 3, timeStart: '2024-08-15', timeEnd: '2024-11-15', maxStudents: 40, currentStudents: 35 },
        { id: 3, name: "General Course 3", courseCredits: 1, timeStart: '2024-09-01', timeEnd: '2024-12-01', maxStudents: 60, currentStudents: 45 },
    ],
    specialized: [
        { id: 1, name: "Specialized Course 1", courseCredits: 4, timeStart: '2024-08-20', timeEnd: '2024-11-20', maxStudents: 30, currentStudents: 25 },
        { id: 2, name: "Specialized Course 2", courseCredits: 3, timeStart: '2024-09-05', timeEnd: '2024-12-05', maxStudents: 35, currentStudents: 20 },
        { id: 3, name: "Specialized Course 3", courseCredits: 2, timeStart: '2024-08-25', timeEnd: '2024-11-25', maxStudents: 40, currentStudents: 38 },
    ]
};

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
    {
        title: 'Sĩ Số Tối Đa',
        dataIndex: 'maxStudents',
        key: 'maxStudents',
    },
    {
        title: 'Sĩ Số Hiện Tại',
        dataIndex: 'currentStudents',
        key: 'currentStudents',
    },
    {
        title: 'Trạng Thái',
        key: 'status',
        render: (_, record) => record.currentStudents < record.maxStudents ? 'Còn Chỗ' : 'Đã Đầy',
    },
];

export default function Available() {
    const [activeTab, setActiveTab] = useState('general');
    const [filteredCourses, setFilteredCourses] = useState(availableCoursesInfo[activeTab]);
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        filterCourses();
    }, [dateRange, activeTab]);

    const filterCourses = () => {
        const [start, end] = dateRange;
        const coursesToFilter = availableCoursesInfo[activeTab];
        if (start && end) {
            const filtered = coursesToFilter.filter(course => {
                const courseStart = moment(course.timeStart);
                const courseEnd = moment(course.timeEnd);
                return (courseStart.isSameOrAfter(start, 'day') && courseStart.isSameOrBefore(end, 'day')) ||
                       (courseEnd.isSameOrAfter(start, 'day') && courseEnd.isSameOrBefore(end, 'day')) ||
                       (courseStart.isBefore(start, 'day') && courseEnd.isAfter(end, 'day'));
            });
            setFilteredCourses(filtered);
        } else {
            setFilteredCourses(coursesToFilter);
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleResetFilter = () => {
        setDateRange([null, null]);
        setFilteredCourses(availableCoursesInfo[activeTab]);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        setFilteredCourses(availableCoursesInfo[key]);
    };

    return (
        <div className='available-container'>
            <Header />
            <div className='available'>
                <h1>Các Khóa Học Có Sẵn</h1>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                    <TabPane tab="Môn Học Chung" key="general">
                        <Table 
                            className='displayer' 
                            dataSource={filteredCourses} 
                            columns={columns} 
                            rowKey="id" 
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                    <TabPane tab="Môn Học Chuyên Ngành" key="specialized">
                        <Table 
                            className='displayer' 
                            dataSource={filteredCourses} 
                            columns={columns} 
                            rowKey="id" 
                            pagination={{ pageSize: 10 }}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}