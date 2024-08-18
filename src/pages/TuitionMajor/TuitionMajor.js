import React, { useState, useEffect } from "react";
import './TuitionMajor.css';
import Header from "../../components/tuitionHeader";
import { Typography, Select, Input, Button, Table, message, Popconfirm, Tabs } from "antd";
import { getFees, addFeeToStudents, removeFeeFromAllStudents, editFeeForStudents, addCreditBasedFeeToStudents } from "../../data/TuitionData";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function TuitionMajor() {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [semester, setSemester] = useState('');
  const [amount, setAmount] = useState('');
  const [creditCost, setCreditCost] = useState('');

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
        getFees(setFees);
        setSelectedFee(null);
        setAmount('');
        setSemester('');
      })
      .catch(error => {
        console.error("Error adding fee:", error);
        message.error('Failed to add fee');
      });
  };

  const handleAddCreditBasedFee = () => {
    if (!creditCost) {
      message.error('Please enter the cost per credit');
      return;
    }
    addCreditBasedFeeToStudents(parseFloat(creditCost))
      .then((count) => {
        message.success(`Học Phí added successfully to ${count} students`);
        getFees(setFees);
        setCreditCost('');
      })
      .catch(error => {
        console.error("Error adding Học Phí:", error);
        message.error('Failed to add Học Phí');
      });
  };

  const handleDeleteFee = (feeId) => {
    removeFeeFromAllStudents(feeId)
      .then((count) => {
        message.success(`Fee deleted successfully from ${count} students`);
        getFees(setFees);
      })
      .catch(error => {
        console.error("Error deleting fee:", error);
        message.error('Failed to delete fee');
      });
  };

  const isCreditBased = (id) => id.startsWith('feee_');

  const extractCredits = (name) => {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  const handleEditFee = (feeId, updatedFee) => {
    let newFee = updatedFee;
    if (isCreditBased(feeId)) {
      const totalCredits = extractCredits(updatedFee.name);
      if (totalCredits === null) {
        message.error('Invalid credit-based fee name. Unable to extract credit count.');
        return;
      }
      const newCreditCost = parseFloat(updatedFee.amount);
      newFee = {
        ...updatedFee,
        amount: (totalCredits * newCreditCost).toFixed(2)
      };
    }
    editFeeForStudents(feeId, newFee)
      .then((count) => {
        message.success(`Fee updated successfully for ${count} students`);
        getFees(setFees);
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
          disabled={isCreditBased(record.id)}
          onBlur={(e) => handleEditFee(record.id, { name: e.target.value })}
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        if (isCreditBased(record.id)) {
          const totalCredits = extractCredits(record.name);
          if (totalCredits === null) {
            return (
              <Text>Học Phí Chứa Tín Chỉ</Text>
            );
          }
          const creditCost = parseFloat(record.amount) / totalCredits;
          return (
            <Input
              defaultValue={creditCost.toFixed(2)}
              addonAfter="VNĐ/Credit"
              onBlur={(e) => handleEditFee(record.id, { amount: e.target.value, name: record.name })}
            />
          );
        } else {
          return (
            <Input
              defaultValue={text}
              addonAfter="VNĐ"
              onBlur={(e) => handleEditFee(record.id, { amount: e.target.value })}
            />
          );
        }
      },
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
        <Tabs defaultActiveKey="1">
          <TabPane tab="Add Fixed Fee" key="1">
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
          </TabPane>
          <TabPane tab="Add Học Phí" key="2">
            <div className="frm">
              <Title level={4}>Học Phí Details</Title>
              <div className="ops">
                <Text>Cost per Credit: </Text>
                <Input
                  style={{ width: '30%', marginRight: '150px', marginLeft: '10px' }}
                  placeholder="Nhập số tiền cho 1 tín chỉ"
                  addonAfter="VNĐ"
                  value={creditCost}
                  onChange={(e) => setCreditCost(e.target.value)}
                />
              </div>
              <div className="btn">
                <Button type="primary" onClick={handleAddCreditBasedFee} style={{ marginRight: '10px' }}>
                  Add Học Phí
                </Button>
              </div>
            </div>
          </TabPane>
        </Tabs>
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