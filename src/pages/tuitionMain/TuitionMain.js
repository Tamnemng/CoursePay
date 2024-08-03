import React, { useRef, useState } from "react";
import './TuitionMain.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Table, Input, Button, Space } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
const {Title, Text} = Typography;



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
            close
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '20%',
      ...getColumnSearchProps('age'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
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
                defaultValue={'cntt'}
                options={[
                  {
                    value: 'cntt',
                    label: 'Công nghệ thông tin',
                  },
                  {
                    value: 'spt',
                    label: 'Sư phạm tin',
                  }
                ]}
              />
            </div>
            <Table columns={columns}/>
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
                  {
                    value: '20222023',
                    label: '2022 - 2023',
                  },
                  {
                    value: '20232024',
                    label: '2023-2024'
                  }
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
                  {
                    value: '1',
                    label: 'Học kỳ 1',
                  },
                  {
                    value: '2',
                    label: 'Học kỳ 2'
                  },
                  {
                    value: '3',
                    label: 'Học kỳ hè'
                  }
                ]}
              />
            </div>
            <Text>Mã sinh viên: </Text>
            <Text>Họ tên sinh viên: </Text>
          </div>
        </div>
      </div>
    </div>
  );
}