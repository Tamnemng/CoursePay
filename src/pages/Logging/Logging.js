import './Logging.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Input, Button, Radio, Space, message } from 'antd';

export default function Logging() {
    const navigate = useNavigate();
    const [value, setValue] = useState(1);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingState, setLoggingState] = useState(false);

    useEffect(() => {
        localStorage.setItem('isAuthenticated', 'false');
        console.log('Initial isAuthenticated:', localStorage.getItem('isAuthenticated'));
    }, []);

    const checking = async () => {
        if (!username || !password) {
            message.error('Vui lòng điền tên đăng nhập và mật khẩu!');
            return;
        }
        setLoggingState(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (username === '123' && password === '123') {
                message.success('Đăng nhập thành công!');
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('lastActivityTime', new Date().getTime().toString());
                console.log('Login successful, isAuthenticated:', localStorage.getItem('isAuthenticated'));
                navigate('/home');
            } else {
                message.error('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            message.error('Đã xảy ra lỗi khi đăng nhập');
        } finally {
            setLoggingState(false);
        }
    };

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            checking();
        }
    };

    return (
        <div className="Web">
            <header className="Web-header">
                <div className='Logging'>
                    <Input
                        placeholder='input username'
                        className='input-field'
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input.Password
                        placeholder="input password"
                        className='input-field'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button
                        type="primary"
                        onClick={checking}
                        className='input-button'
                        loading={loggingState}
                    >
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
