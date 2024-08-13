import React, { useState } from 'react';
import Header from '../../components/Header';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import './History.css';
import { studentInfo } from '../../data/studentData';

const paidFees = studentInfo.fees.filter(fee => fee.paid);

const columns = [
    {
        title: 'Mã Hóa Đơn',
        dataIndex: 'id',
        key: 'id1',
    },
    {
        title: 'Tên Phí',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Số Tiền',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Ngày Thanh Toán',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
    },
];

export default function History() {
    const [filteredFees, setFilteredFees] = useState(paidFees);

    const handleDateChange = (dates) => {
        if (dates) {
            const [start, end] = dates;
            const filtered = paidFees.filter(fee => {
                const paymentDate = moment(fee.paymentDate);
                return paymentDate.isBetween(start, end, 'days', '[]');
            });
            setFilteredFees(filtered);
        } else {
            setFilteredFees(paidFees);
        }
    };

    return (
        <div className='history-container'>
            <Header />
            <div className='history'>
                <h1>Lịch Sử Đóng Tiền</h1>
                <div className='filter-container'>
                    <DatePicker.RangePicker onChange={handleDateChange} />
                </div>
                <div className='table-container'>
                    <Table className='displayer' dataSource={filteredFees} columns={columns} rowKey="id" />
                </div>
            </div>
        </div>
    );
}
