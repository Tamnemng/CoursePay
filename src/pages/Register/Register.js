import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Register.css';
import { FloatButton, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const columns = [
    {
        title: 'Tên Học Phần',
        dataIndex: 'name',
    },
    {
        title: 'Mã Học Phần',
        dataIndex: 'id',
    },
    {
        title: 'Sỉ Số',
        dataIndex: 'class_size',
    },
    {
        title: 'Tên Giáo Viên',
        dataIndex: 'lecturers',
    },
    {
        title: 'Ngày Bắt Đầu',
        dataIndex: 'started_day',
    },
    {
        title: 'Ngày Kết Thúc',
        dataIndex: 'ended_day',
    },
];
const data = [
    {
        key: '2',
        name: 'Môn 2',
        id: 'mon2',
        class_size: 35,
        lecturers: 'tran thi B',
        started_day: '02/01/2024',
        ended_day: '02/06/2024',
    },
    {
        key: '3',
        name: 'Môn 3',
        id: 'mon3',
        class_size: 30,
        lecturers: 'le van C',
        started_day: '03/01/2024',
        ended_day: '03/06/2024',
    },
    {
        key: '4',
        name: 'Môn 4',
        id: 'mon4',
        class_size: 25,
        lecturers: 'pham thi D',
        started_day: '04/01/2024',
        ended_day: '04/06/2024',
    },
    {
        key: '5',
        name: 'Môn 5',
        id: 'mon5',
        class_size: 40,
        lecturers: 'nguyen van E',
        started_day: '05/01/2024',
        ended_day: '05/06/2024',
    }
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    //if class size is equal to 50 the class will be disabled for register
    getCheckboxProps: (record) => ({
        disabled: record.class_size === 50,
        name: record.name,
    }),
};

export default function Register() {
    const [selectionType, setSelectionType] = useState('checkbox');
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/new-page'); // Replace with your desired route
    };

    return (
        <div className='register-container'>
            <Header />
            <div className='register'>
                <h1>
                    Đăng ký môn chung
                </h1>
                <div className='table-container'>
                    <Table className='displayer'
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={data}
                    />
                </div>
            </div>
        </div>
    )
}
