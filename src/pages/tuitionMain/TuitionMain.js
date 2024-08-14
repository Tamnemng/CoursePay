import React, { useRef, useState, useEffect } from "react";
import './TuitionMain.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Input, Button, Modal, Form, message, Space, Table, Radio } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { getStudents, getFees } from "../../data/TuitionData";

const { Title, Text } = Typography;

export default function TuitionMain() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const [visible, setVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [selectedStudentID, setSelectedStudentID] = useState(null);
  const [value, setValue] = useState(1);

  useEffect(() => {
    getStudents((studentsList) => {
      setStudents(studentsList);
    });
  }, []);

  useEffect(() => {
    if (selectedStudentID) {
      getFees(selectedStudentID, (feesList) => {
        setFees(feesList);
      });
    }
  }, [selectedStudentID]);

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const paymColumns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'paymID',
      key: 'paymID',
      ...getColumnSearchProps('paymID'),
      width: 50,
    },
    {
      title: 'Tên hóa đơn',
      dataIndex: 'paymName',
      key: 'paymName',
      ...getColumnSearchProps('pYmName'),
      width: 80,
    },
  ];

  const stuColumns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'stuID',
      key: 'stuID',
      ...getColumnSearchProps('stuID'),
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'stuName',
      key: 'stuName',
      ...getColumnSearchProps('stuName'),
    },
    {
      title: 'Giảm phí',
      dataIndex: 'spe',
      key: 'spe',
      ...getColumnSearchProps('spe'),
      width: 80,
    },
  ];

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
                  width: 200,
                  marginLeft: 5,
                }}
                defaultValue={'all'}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'cntt', label: 'Công nghệ thông tin' },
                  { value: 'spt', label: 'Sư phạm tin' },
                  { value: 'spl', label: 'Sư phạm lý' },
                ]}
              />
            </div>
            <Table
              columns={stuColumns}
              dataSource={students}
              pagination={{
                pageSize: 10,
              }}
              scroll={{
                y: 240,
              }}
              onRow={(record) => ({
                onClick: () => setSelectedStudentID(record.stuID),
              })}
            />
          </div>
          <div className="payment">
            <Title level={5}>Danh sách hóa đơn</Title>
            <div className="ops">
              <Text>Năm học</Text>
              <Select
                defaultValue="20232024"
                style={{
                  width: 120,
                  marginRight: 40,
                  marginLeft: 5,
                }}
                options={[
                  { value: '20222023', label: '2022 - 2023' },
                  { value: '20232024', label: '2023 - 2024' }
                ]}
              />
              <Text>Học kỳ</Text>
              <Select
                defaultValue="1"
                style={{
                  width: 110,
                  marginLeft: 5,
                }}
                options={[
                  { value: '1', label: 'Học kỳ 1' },
                  { value: '2', label: 'Học kỳ 2' },
                  { value: '3', label: 'Học kỳ hè' }
                ]}
              />
            </div>
            <div className="ops">
              <Text>Mã sinh viên: </Text>
              <Input
                className="customInp"
                value={selectedStudentID || ''}
                readOnly
              />
            </div>
            <div className="ops">
              <Text>Họ tên sinh viên: </Text>
              <Input
                className="customInp"
                value={(students.find(s => s.stuID === selectedStudentID) || {}).stuName || ''}
                readOnly
              />
            </div>
            <div>
              <Radio.Group value={value}>
                <Radio value={1}>Tất cả</Radio>
                <Radio value={2}>Đã đóng</Radio>
                <Radio value={3}>Chưa đóng</Radio>
              </Radio.Group>
            </div>
            <Table
              columns={paymColumns}
              dataSource={fees}
              pagination={{
                pageSize: 50,
              }}
              scroll={{
                y: 240,
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
            />
            <Modal
              title="Chi tiết hóa đơn"
              open={visible}
              onCancel={handleCancel}
              footer={[
                <Button key={"update"} type="primary" >
                  Update
                </Button>,
                <Button key={"delete"} type="dashed" danger >
                  Delete
                </Button>,
              ]}
            >
              {selectedRow ? (
                <div>
                  <p><strong>Mã hóa đơn:</strong> 
                    <Input value={selectedRow.id} readOnly/>
                  </p>
                  <p><strong>Tên hóa đơn:</strong> 
                    <Input value={selectedRow.name}/>
                  </p>
                  <p><strong>Số tiền:</strong> 
                    <Input value={selectedRow.amount}/>
                  </p>
                  <p><strong>Tình trạng:</strong> 
                    <Input value={selectedRow.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}/>
                  </p>
                  <p><strong>Ngày thanh toán:</strong> 
                    <Input value={selectedRow.paymentDate}/>
                  </p>
                </div>
              ) : (
                <p>No data available</p>
              )}
            </Modal>
            <Button type={'primary'} >Thêm hóa đơn</Button>
          </div>
        </div>

        {/* Modal thêm hóa đơn */}
        <Modal
          title="Thêm hóa đơn"
          footer={null}
        >
          <Form
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Tên hóa đơn"
              rules={[{ required: true, message: 'Vui lòng nhập tên hóa đơn!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Số tiền"
              rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="paid"
              label="Tình trạng thanh toán"
              rules={[{ required: true, message: 'Vui lòng chọn tình trạng thanh toán!' }]}
            >
              <Select>
                <Select.Option value="true">Đã thanh toán</Select.Option>
                <Select.Option value="false">Chưa thanh toán</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="paymentDate"
              label="Ngày thanh toán"
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
