import React, { useState, useEffect } from "react";
import './TuitionMajor.css';
import Header from "../../components/tuitionHeader";
import { Typography, Select, Input, Button, Table, message, Popconfirm } from "antd";
import { getFees, addFeeToStudents, removeFeeFromAllStudents, editFeeForStudents } from "../../data/TuitionData";

const { Title, Text } = Typography;

export default function TuitionMajor() {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [semester, setSemester] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    getFees(setFees);
  }, []);

  const handleAddFee = () => {
    if (!selectedFee || !amount) {
      message.error('Please fill in all fields');
      return;
    }
    const newFee = {
      name: selectedFee,
      amount: amount
    };
    addFeeToStudents(newFee, semester)
      .then((count) => {
        message.success(`Fee added successfully to ${count} students`);
        getFees(setFees); // Refresh the fees list

        // Reset the form fields
        setSelectedFee(null);  // or ''
        setAmount('');
        setSemester(''); // if you want to reset semester as well
      })
      .catch(error => {
        console.error("Error adding fee:", error);
        message.error('Failed to add fee');
      });
  };


  const handleDeleteFee = (feeId) => {
    removeFeeFromAllStudents(feeId)
      .then((count) => {
        message.success(`Fee deleted successfully from ${count} students`);
        getFees(setFees); // Refresh the fees list
      })
      .catch(error => {
        console.error("Error deleting fee:", error);
        message.error('Failed to delete fee');
      });
  };

  const handleEditFee = (feeId, updatedFee) => {
    editFeeForStudents(feeId, updatedFee)
      .then((count) => {
        message.success(`Fee updated successfully for ${count} students`);
        getFees(setFees); // Refresh the fees list
      })
      .catch(error => {
        console.error("Error updating fee:", error);
        message.error('Failed to update fee');
      });
  };

  const columns = [
    {
      title: 'Fee ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Input
          defaultValue={text}
          onBlur={(e) => handleEditFee(record.id, { name: e.target.value })}
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <Input
          defaultValue={text}
          addonAfter="VNĐ"
          onBlur={(e) => handleEditFee(record.id, { amount: e.target.value })}
        />
      ),
    },
    {
      title: 'Paid Count',
      dataIndex: 'paidCount',
      key: 'paidCount',
    },
    {
      title: 'Unpaid Count',
      dataIndex: 'unpaidCount',
      key: 'unpaidCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this fee?"
          onConfirm={() => handleDeleteFee(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="dashed" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="tuitionMajor-container">
      <Header />
      <div className="tuitionMajor">
        <div className="tl">
          <Title level={3}>Semester Tuition</Title>
        </div>
        <div className="frm">
          <Title level={4}>Fee Details</Title>
          <div className="ops">
            <Text>Fee Code: </Text>
            <Input
              style={{ width: '30%', marginRight: '150px', marginLeft: '10px' }}
              placeholder="Tên học phí"
              onChange={(e) => setSelectedFee(e.target.value)}
            />
          </div>
          <div className="ops">
            <Text>Amount: </Text>
            <Input
              style={{ width: '30%', marginRight: '150px', marginLeft: '10px' }}
              placeholder="Nhập số tiền cần được đóng"
              addonAfter="VNĐ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Text>Semester: </Text>
            <Select
              style={{ width: '200px', marginLeft: '10px' }}
              value={semester}
              onChange={(value) => setSemester(value)}
            >
              <Select.Option value="">All</Select.Option>
              <Select.Option value="HK1">HK1</Select.Option>
              <Select.Option value="HK2">HK2</Select.Option>
              <Select.Option value="HK3">HK3</Select.Option>
              <Select.Option value="HK4">HK4</Select.Option>
              <Select.Option value="HK5">HK5</Select.Option>
              <Select.Option value="HK6">HK6</Select.Option>
            </Select>
          </div>
          <div className="btn">
            <Button type="primary" onClick={handleAddFee} style={{ marginRight: '10px' }}>
              Add
            </Button>
          </div>
        </div>
        <div className="frm">
          <Title level={4}>Tuition List</Title>
          <div className="feesList">
            <Table
              dataSource={fees}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
}