import React, { useState } from 'react';
import {
  BankOutlined,
  ApartmentOutlined,
  BookOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

const items = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: 'Trang Chủ',
  },
  {
    key: 'tuition',
    icon: <BankOutlined />,
    label: 'Học Phí',
    children: [
      {
        key: 'pay-tuition',
        label: 'Đóng Học Phí',
      },
      {
        key: 'tuition-history',
        label: 'Lịch Sử Đóng Học Phí',
      },
    ]
  },
  {
    key: 'courses',
    label: 'Học Phần',
    icon: <BookOutlined />,
    children: [
      {
        key: 'register-courses',
        label: 'Đăng Kí Học Phần',
        children: [
          {
            key: 'general-courses',
            label: 'Đăng Ký Môn Chung',
          },
          {
            key: 'specialized-courses',
            label: 'Đăng Ký Chuyên Ngành',
          },
          {
            key: 'improve-courses',
            label: 'Đăng Ký Ngoài Kế Hoạch',
          },
        ]
      },
      {
        key: 'registered-courses',
        label: 'Học Phần Đã Đăng Ký',
      },
    ],
  },
  {
    key: 'contact',
    label: 'Thông Tin Liên lạc',
    icon: <ApartmentOutlined />,
  },
  {
    key: 'logout',
    label: "Đăng Xuất",
  }
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

export default function Header() {
  const [stateOpenKeys, setStateOpenKeys] = useState(['tuition', 'courses']);
  const navigate = useNavigate();

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

  const onClick = (e) => {
    const { key } = e;
    switch (key) {
      case 'home':
        navigate('/home');
        break;
      case 'pay-tuition':
        navigate('/tuition/pay');
        break;
      case 'tuition-history':
        navigate('/tuition/history');
        break;
      case 'registered-courses':
        navigate('/courses/registered');
        break;
      case 'general-courses':
        navigate('/courses/register/general');
        break;
      case 'specialized-courses':
        navigate('/courses/register/specialized');
        break;
      case 'improve-courses':
        navigate('/courses/register/improve');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'logout':
        localStorage.setItem('isAuthenticated', 'false');
        navigate('');
        break;
      default:
        if (!items.find(item => item.key === key)?.children) {
          navigate(`/${key}`);
        }
    }
  };

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['home']}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      onClick={onClick}
      style={{
        width: 256,
      }}
      items={items}
    />
  );
}