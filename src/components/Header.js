import React, { Children, useState } from 'react';
import { 
    BankOutlined,
    ApartmentOutlined,
    BookOutlined, 
} from '@ant-design/icons';
import { Menu } from 'antd';

const items = [
    {
      key: '1',
      icon: <BankOutlined />,
      label: 'Học Phí',
      children: [
        {
          key: '2',
          label: 'Đóng Học Phí',
        },
        {
          key: '3',
          label: 'Lịch Sử Đóng Học Phí',
        },
      ]
    },
    {
      key: '4',
      label: 'Học Phần',
      icon: <BookOutlined />,
      children: [
        {
          key: '5',
          label: 'Đăng Kí Học Phần',
        },
        {
          key: '6',
          label: 'Học Phần Đã Đăng Ký',
        },
        {
          key: '7',
          label: 'Học Phần Khả Dụng',
        },
      ],
    },
    {
      key: '8',
      label: 'Thông Tin Liên lạc',
      icon: <ApartmentOutlined />,
    },
];

const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);

export default function Header(){
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['231']}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      style={{
        width: 256,
      }}
      items={items}
    />
  );
};
