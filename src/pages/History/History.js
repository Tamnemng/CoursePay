import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Table, Spin } from 'antd';
import './History.css';
import { getStudentPaid } from '../../data/studentData';

const columns = [
    {
        title: 'Mã Hóa Đơn',
        dataIndex: 'id',
        key: 'id',
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
    const [paidFees, setPaidFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fees = await getStudentPaid();
                if (!fees) {
                    throw new Error('Failed to fetch general subjects');
                }
                const processedFees = Object.entries(fees)
                    .filter(([_, fees]) => fees.paid === true)
                    .map(([id, fees]) => ({
                        ...fees,
                        id
                    }));
                setPaidFees(processedFees);
                setLoading(false);
            }
            catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load courses. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    if (loading) {
        return <div>{Spin}</div>
    }

    if (error) {
        return <div>{error}</div>
    }
    return (
        <div className='history-container'>
            <Header />
            <div className='history'>
                <h1>Lịch Sử Đóng Tiền</h1>
                <div className='table-container'>
                    <Table className='displayer' dataSource={paidFees} columns={columns} rowKey="id" />
                </div>
            </div>
        </div>
    );
}
