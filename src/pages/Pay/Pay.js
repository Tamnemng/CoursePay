import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Pay.css';
import { Form, Input, InputNumber, Button, Select, message, Typography, Checkbox, Space, Tag } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { studentInfo } from '../../data/studentData';
const { Option } = Select;
const { Text, Title } = Typography;




export default function Pay() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFees, setSelectedFees] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [studentData, setStudentData] = useState(studentInfo);

    const unpaidFees = studentData.fees.filter(fee => !fee.paid);

    useEffect(() => {
        const newTotal = selectedFees.reduce((sum, feeId) => {
            const fee = studentData.fees.find(f => f.id === feeId);
            return sum + (fee && !fee.paid ? fee.amount : 0);
        }, 0);
        setTotalAmount(newTotal);
        form.setFieldsValue({ amount: newTotal });
    }, [selectedFees, form, studentData.fees]);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Payment submitted:', { ...values, selectedFees });
        
        // Goi Api ra o day de chinh sua thong tin hoc phi sinh vien
        setTimeout(() => {
            // Update payment cho sinh vien
            const updatedFees = studentData.fees.map(fee => {
                if (selectedFees.includes(fee.id)) {
                    return { ...fee, paid: true, paymentDate: new Date().toISOString().split('T')[0] };
                }
                return fee;
            });

            // Update
            setStudentData(prevData => ({
                ...prevData,
                fees: updatedFees
            }));

            setLoading(false);
            message.success('Thanh toán học phí thành công!');
            form.resetFields();
            setSelectedFees([]);
        }, 2000);
    };

    const handleFeeSelection = (checkedValues) => {
        setSelectedFees(checkedValues);
    };

    return (
        <div className='pay-container'>
            <Header />
            <div className='pay'>
                <div className='theupper'>
                    <div className='student-informations'>
                        <Title level={2}>Thông Tin Sinh Viên</Title>
                        <Text>
                            <pre>ID: {studentData.id}</pre>
                            <pre>Họ và tên: {studentData.name}</pre>
                            <pre>Ngành học: {studentData.major}</pre>
                        </Text>
                        <div className='warning'>
                            Yêu cầu sinh viên kiểm tra thông tin thật kỹ trước khi đóng tiền học.
                        </div>
                    </div>
                    <div className='pay-informations'>
                        <Title level={2}>Thanh Toán</Title>
                        <Form
                            form={form}
                            name="tuition_payment"
                            onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block disabled={selectedFees.length === 0}>
                                    Xác nhận thanh toán
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className='fee-selection'>
                    <Title level={3}>Chọn khoản phí cần thanh toán</Title>
                    {unpaidFees.length > 0 ? (
                        <Checkbox.Group onChange={handleFeeSelection} value={selectedFees}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {unpaidFees.map(fee => (
                                    <Checkbox key={fee.id} value={fee.id}>
                                        <Space>
                                            {fee.name} - {fee.amount.toLocaleString('vi-VN')} VNĐ
                                            <Tag color="red">Chưa đóng</Tag>
                                        </Space>
                                    </Checkbox>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    ) : (
                        <Text>Không có khoản phí nào cần thanh toán.</Text>
                    )}
                </div>
            </div>
        </div>
    );
}