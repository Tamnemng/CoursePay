import React, { useState, useEffect } from "react";
import './TuitionMain.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Input, Table, Card, List, Tabs } from "antd";
import { getStudents } from "../../data/TuitionData";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const encodeStudentId = (id) => {
  return id.replace(/\./g, '_');
};

const decodeStudentId = (encodedId) => {
  return encodedId.replace(/_/g, '.');
};

export default function TuitionMain() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    getStudents((studentsList) => {
      console.log('Received students:', studentsList);
      setStudents(studentsList);
      setFilteredStudents(studentsList);
    });
  }, []);

  useEffect(() => {
    filterStudents();
  }, [selectedDepartment, studentIdFilter, selectedSemester, students]);

  const filterStudents = () => {
    let filtered = students;

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(student => student.faculty === selectedDepartment);
    }

    if (studentIdFilter) {
      filtered = filtered.filter(student => student.id.toLowerCase().includes(studentIdFilter.toLowerCase()));
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(student => student.semester === selectedSemester);
    }

    setFilteredStudents(filtered);
  };

  const handleRowClick = (record) => {
    console.log('Row clicked:', record);
    setSelectedStudentID(record.id);
    setSelectedRow(record);
  };

  const stuColumns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'id',
      key: 'stuID',
      width: 120,
      render: (text) => decodeStudentId(text),
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'stuName',
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Đóng Phí',
      key: 'feeInfo',
      render: (_, record) => `${record.paidFees.length}/${record.paidFees.length + record.unpaidFees.length}`
    }
  ];

  const renderFeeList = (fees, isPaid) => (
    <List
      dataSource={fees}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.name}
            description={`Số tiền: ${item.amount}`}
          />
          <div>
            <p>Tình trạng: {isPaid ? 'Đã đóng' : 'Chưa đóng'}</p>
            {isPaid && <p>Ngày đóng: {item.paymentDate || 'N/A'}</p>}
          </div>
        </List.Item>
      )}
      locale={{ emptyText: 'Không có hóa đơn nào' }}
    />
  );

  return (
    <div className="tuitionMain-container">
      <Header />
      <div className="tuitionMain">
        <div className="tl">
          <Title level={3}>Quản lý học phí</Title>
        </div>
        <div className="info">
          <div className="student">
            <Title level={5}>Danh sách sinh viên</Title>
            <div className="ops">
              <Text>Ngành học</Text>
              <Select
                style={{
                  width: 250,
                  marginLeft: 5,
                }}
                value={selectedDepartment}
                onChange={(value) => setSelectedDepartment(value)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'Khoa Công Nghệ Thông Tin', label: 'Khoa Công Nghệ Thông Tin' },
                  { value: 'Khoa Anh', label: 'Khoa Anh' },
                  { value: 'Khoa Toán', label: 'Khoa Toán' },
                ]}
              />
            </div>
            <div className="ops">
              <Text>Mã sinh viên</Text>
              <Input
                style={{
                  width: 200,
                  marginLeft: 5,
                }}
                value={studentIdFilter}
                onChange={(e) => setStudentIdFilter(e.target.value)}
                placeholder="Nhập mã sinh viên"
              />
            </div>
            <div className="ops">
              <Text>Học kỳ</Text>
              <Select
                style={{
                  width: 150,
                  marginLeft: 5,
                }}
                value={selectedSemester}
                onChange={(value) => setSelectedSemester(value)}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'HK1', label: 'Học kỳ 1' },
                  { value: 'HK2', label: 'Học kỳ 2' },
                  { value: 'HK3', label: 'Học kỳ 3' },
                  { value: 'HK4', label: 'Học kỳ 4' },
                  { value: 'HK5', label: 'Học kỳ 5' },
                  { value: 'HK6', label: 'Học kỳ 6' },
                ]}
              />
            </div>
            <Table
              columns={stuColumns}
              dataSource={filteredStudents.map(student => ({
                ...student,
                id: encodeStudentId(student.id)
              }))}
              pagination={{
                pageSize: 10,
              }}
              scroll={{
                y: 240,
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick({ ...record, id: decodeStudentId(record.id) }),
              })}
            />
          </div>
          <div className="payment">
            <Title level={5}>Thông tin hóa đơn</Title>
            {selectedStudentID ? (
              <Card title={`Thông tin sinh viên: ${selectedRow?.name}`} >
                <p>Mã sinh viên: {selectedStudentID}</p>
                <p>Khoa: {selectedRow?.faculty}</p>
                <p>Học kỳ: {selectedRow?.semester}</p>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Đã đóng" key="1">
                    {renderFeeList(selectedRow?.paidFees || [], true)}
                  </TabPane>
                  <TabPane tab="Chưa đóng" key="2">
                    {renderFeeList(selectedRow?.unpaidFees || [], false)}
                  </TabPane>
                </Tabs>
              </Card>
            ) : (
              <p>Vui lòng chọn một sinh viên để xem thông tin hóa đơn</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}