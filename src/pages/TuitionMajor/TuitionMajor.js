import React from "react";
import './TuitionMajor.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select } from "antd";

const {Title, Text} = Typography;


export default function TuitionMajor() {
  return (
    <div className="tuitionMajor-container">
      <Header />
      <div className="tuitionMajor">
        <div className="tl">
          <Title level={3}>Học phí học kỳ</Title>
        </div>
        <div className="frm">
          <Title level={4}>Chi tiết học phí</Title>
          
          
        </div>
        <div className="frm">
          <Title level={4}>Danh sách học phí</Title>
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
      </div>
    </div>
  );
}