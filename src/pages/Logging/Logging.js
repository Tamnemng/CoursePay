import './Logging.css';
import Home from '../Home/Home';
import { useNavigate } from 'react-router-dom';
import React, { useState} from 'react';
import { Input, Button, Radio, Space, message } from 'antd';


export default function Logging() {
    const navigate = useNavigate();
    const [value, setValue] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const checking = () => {
        if (!username || !password) {
            message.error('Vui lòng điền tên đăng nhập và mật khẩu!');
            return;
        }
        // THỊNH THÊM PHẦN KIỂM TRA TÊN VÀ MẬT KHẨU NHA VÔ ĐÂY NHA <3333
        // khúc này nhờ minh thử cái giả sử nó/home nó vô đc thì sao kkkk hỏi thử minh cái đó
        if (username === '123' && password === '123') {
            message.success('Đăng nhập thành công!');
            navigate('/home');
        } else {
            message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
    };

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div className="Web">
            <header className="Web-header">
                <div className='Logging'>
                    <Input placeholder='input username' className='input-field' required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <Input.Password placeholder="input password" className='input-field' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="primary" onClick={checking} className='input-button'>
                        Logging
                    </Button>
                    <Radio.Group onChange={onChange} value={value}>
                        <Space direction="vertical">
                            <Radio value={1} className='radio-button'>Sinh Viên</Radio>
                            <Radio value={2} className='radio-button'>Cán Bộ</Radio>
                        </Space>
                    </Radio.Group>
                </div>
            </header>
        </div>
    );
}


