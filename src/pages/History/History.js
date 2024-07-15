import React, { useState } from 'react';
import Header from '../../components/Header';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import './History.css';

//thông tin sinh viên trước mắt sẽ bao gồm các ý dưới
// tên, mssv, các khoản phí[khoảng phí, mã hóa đơn,....], chuyên ngành,...
//thêm api gọi thông tin sinh viên
const studentInfo = {
    id: "48.01.104.128",
    name: "Nguyễn Phúc Thịnh",
    major: "Công nghệ thông tin",
    fees: [
        { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
        { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2020-07-15" },
        { id: 3, name: "Phí ký túc xá", amount: 2000000, paid: false, paymentDate: null },
        { id: 4, name: "Phí ăn uống", amount: 300000, paid: true, paymentDate: '2024-07-16' },
        { id: 5, name: "Phí sách giáo khoa", amount: 1000000, paid: true, paymentDate: '2024-07-01' },
        { id: 6, name: "Phí hội thảo", amount: 200000, paid: true, paymentDate: '2024-07-02' },
        { id: 7, name: "Phí câu lạc bộ", amount: 300000, paid: true, paymentDate: '2024-07-03' },
        { id: 8, name: "Phí xe buýt", amount: 500000, paid: true, paymentDate: '2024-07-04' },
        { id: 9, name: "Phí thể thao", amount: 600000, paid: true, paymentDate: '2024-07-05' },
        { id: 10, name: "Phí dự phòng", amount: 1500000, paid: true, paymentDate: '2024-07-06' },
        { id: 11, name: "Phí bảo trì", amount: 250000, paid: true, paymentDate: '2024-07-07' },
        { id: 12, name: "Phí tài liệu học tập", amount: 800000, paid: true, paymentDate: '2024-07-08' },
        { id: 13, name: "Phí internet", amount: 400000, paid: true, paymentDate: '2024-07-09' },
        { id: 14, name: "Phí quản lý", amount: 350000, paid: true, paymentDate: '2024-07-10' },
        { id: 15, name: "Phí hội nhóm", amount: 450000, paid: true, paymentDate: '2024-07-11' },
        { id: 16, name: "Phí thực hành", amount: 1200000, paid: true, paymentDate: '2024-07-12' },
        { id: 17, name: "Phí bảo dưỡng", amount: 600000, paid: true, paymentDate: '2024-07-13' },
        { id: 18, name: "Phí vệ sinh", amount: 700000, paid: true, paymentDate: '2024-07-14' },
        { id: 19, name: "Phí dịch vụ", amount: 550000, paid: true, paymentDate: '2024-07-15' },
        { id: 20, name: "Phí thuê phòng", amount: 800000, paid: true, paymentDate: '2024-07-16' }
    ],
};

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
