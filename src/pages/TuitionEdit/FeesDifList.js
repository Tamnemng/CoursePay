import React, { useRef, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { Button, Table, Space, Input} from "antd";

const data = [
  {
    paymID: '001',
    paymName: 'Học phí học kỳ',
    
  },
  {
    paymID: '002',
    paymName: 'BHYT',
    
  },
  {
    paymID: '003',
    paymName: 'Trung tâm Tin học',
    
  },
];

export default function FeesDifList() {
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
      title: 'Mã phí',
      dataIndex: 'fID',
      key: 'fID',
      ...getColumnSearchProps('fID'),

    },
    {
      title: 'Năm học',
      dataIndex: 'year',
      key: 'year',
      ...getColumnSearchProps('year'),
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
      ...getColumnSearchProps('semester'),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'date',
      key: 'date',
      ...getColumnSearchProps('date'),
    },
   
  ];

  return(
    <div>
      <Table 
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          y: 240,
        }}
        //dataSource={data}
      />
    </div>
  );
}