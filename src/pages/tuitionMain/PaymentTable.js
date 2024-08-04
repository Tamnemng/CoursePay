import React, { useRef, useState } from "react";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { Button, Table, Space, Input } from "antd";

const data = [
  {
    stuID: '48.01.104.000',
    stuName: 'John Brown',
    spe: 'true',
  },
  {
    stuID: '48.01.104.080',
    stuName: 'John Wick',
    spe: 'false',
  },
  {
    stuID: '48.01.104.020',
    stuName: 'Doe',
    spe: 'true',
  },
  {
    stuID: '48.01.104.013',
    stuName: 'Hunt',
    spe: 'true',
  },
];

export default function PaymentTable() {
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
      title: 'Mã hóa đơn',
      dataIndex: 'paymID',
      key: 'paymID',
      ...getColumnSearchProps('paymID'),
    },
    {
      title: 'Tên hóa đơn',
      dataIndex: 'paymName',
      key: 'paymName',
      ...getColumnSearchProps('paymName'),
    },
    {
        title: 'Ngày thanh toán',
        dataIndex: 'date',
        key: 'date',
        ...getColumnSearchProps('date'),
    },
  ];

  return(
    <Table 
      columns={columns}
      pagination={{
        pageSize: 50,
      }}
      scroll={{
        y: 240,
      }}
      //dataSource={data}
    />
  );
}