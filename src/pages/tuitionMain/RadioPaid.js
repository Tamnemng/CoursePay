import React, { useState } from 'react';
import { Radio } from 'antd';

const RadioPaid = () => {
  const [value, setValue] = useState(1);
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  return (
    <Radio.Group onChange={onChange} value={value}>
      <Radio value={1}>Tất cả</Radio>
      <Radio value={2}>Đã đóng</Radio>
      <Radio value={3}>Chưa đóng</Radio>
    </Radio.Group>
  );
};
export default RadioPaid;