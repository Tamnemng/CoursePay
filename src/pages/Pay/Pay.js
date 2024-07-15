import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Pay.css';
import { Form, Input, InputNumber, Button, Select, message, Typography, Checkbox, Space, Tag } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;

export default function Pay() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedFees, setSelectedFees] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const studentInfo = {
        id: "SV001",
        name: "Nguyễn Văn A",
        major: "Công nghệ thông tin",
        fees: [
            { id: 1, name: "Học phí học kỳ", amount: 10000000, paid: false, paymentDate: null },
            { id: 2, name: "Bảo hiểm y tế", amount: 500000, paid: true, paymentDate: "2024-07-15" },
            { id: 3, name: "Phí ký túc xá", amount: 2000000, paid: false, paymentDate: null },
        ],
    };

    const unpaidFees = studentInfo.fees.filter(fee => !fee.paid);

    useEffect(() => {
        const newTotal = selectedFees.reduce((sum, feeId) => {
            const fee = studentInfo.fees.find(f => f.id === feeId);
            return sum + (fee && !fee.paid ? fee.amount : 0);
        }, 0);
        setTotalAmount(newTotal);
        form.setFieldsValue({ amount: newTotal });
    }, [selectedFees, form]);

    const onFinish = (values) => {
        setLoading(true);
        console.log('Payment submitted:', { ...values, selectedFees });

        setTimeout(() => {
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
                            <pre>ID: {studentInfo.id}</pre>
                            <pre>Họ và tên: {studentInfo.name}</pre>
                            <pre>Ngành học: {studentInfo.major}</pre>
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
                            <Form.Item
                                name="amount"
                                label="Tổng số tiền thanh toán"
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/₫\s?|(,*)/g, '')}
                                    value={totalAmount}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item
                                name="paymentMethod"
                                label="Phương thức thanh toán"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                            >
                                <Select placeholder="Chọn phương thức thanh toán">
                                    <Option value="credit_card">Thẻ tín dụng</Option>
                                    <Option value="bank_transfer">Chuyển khoản ngân hàng</Option>
                                    <Option value="momo">MoMo</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="cardNumber"
                                label="Số thẻ"
                                rules={[{ required: true, message: 'Vui lòng nhập số thẻ!' }]}
                            >
                                <Input prefix={<CreditCardOutlined />} placeholder="Nhập số thẻ" />
                            </Form.Item>

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
    )
};