import React from "react";
import './TuitionMajor.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";

const {Title, Text} = Typography;


export default function TuitionMajor() {
  return (
    <div className="tuitionMajor-container">
      <Header />
      <div className="tuitionMajor">
        <div className="tl">
          <Title level={3}>Học phí học kỳ</Title>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
}