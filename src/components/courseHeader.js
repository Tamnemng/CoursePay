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
        key: 'subject',
        icon: <BankOutlined />,
        label: 'Môn Học',
        children: [
            {
                key: 'add-delete-subject',
                label: 'Thêm và xóa Môn Học',
            },
            {
                key: 'edit-subject',
                label: 'Chỉnh sửa Môn Học',
            },
        ]
    },
    {
        key: 'class',
        label: 'Lớp Học',
        icon: <BookOutlined />,
        children: [
            {
                key: 'add-delete-class',
                label: 'Thêm và xóa Lớp Học',
            },
            {
                key: 'edit-class',
                label: 'Chỉnh sửa Lớp Học',
            },
        ],
    },
    {
        key: 'logout',
        label: 'Đăng Xuất',
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
    const [stateOpenKeys, setStateOpenKeys] = useState(['subject', 'courses']);
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
            case 'add-delete-subject':
                navigate('/courseChange');
                break;
            case 'edit-subject':
                navigate('/courseEdit');
                break;
            case 'add-delete-class':
                navigate('/classChange');
                break;
            case 'edit-class':
                navigate('/classEdit');
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