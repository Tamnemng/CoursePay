import './App.css';
import React, { useState } from 'react';
import { Input, Button, Radio, Space } from 'antd';

function App() {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  return (
    <div className="Web">
      <header className="Web-header">
        <div className='Logging'>
          <Input placeholder='input username' className='input-field' />
          <Input.Password placeholder="input password" className='input-field' />
          <Button type="primary" className='input-field'>Logging</Button>
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
};

export default App;
