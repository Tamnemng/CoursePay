import React from "react";
import './TuitionMain.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Input } from "antd";
import StudentTable from "./StudentTable";
import PaymentTable from "./PaymentTable";
import RadioPaid from "./RadioPaid";

const {Title, Text} = Typography;


export default function TuitionMain() {
  
  return (
    <div className="tuitionMain-container">
      <Header />
      <div className="tuitionMain">
        <div className="tl">
          <Title level={3}>Quản lý học phí</Title>
        </div>
        <div className="info">
          <div className="student">
            <Title level={5}>Danh sách sinh viên</Title>
            <div className="ops">
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
            <StudentTable/>
          </div>
          <div className="payment">
            <Title level={5}>Danh sách hóa đơn</Title>
            <div className="ops">
              <Text>Năm học</Text>
              <Select
                defaultValue="20232024"
                style={{
                  width: 120,
                  marginRight: 40,
                  marginLeft: 5,
                }}
                options={[
                  {
                    value: '20222023',
                    label: '2022 - 2023',
                  },
                  {
                    value: '20232024',
                    label: '2023-2024'
                  }
                ]}
              />
              <Text>Học kỳ</Text>
              <Select
                defaultValue="1"
                style={{
                  width: 110,
                  marginLeft: 5,
                }}
                options={[
                  {
                    value: '1',
                    label: 'Học kỳ 1',
                  },
                  {
                    value: '2',
                    label: 'Học kỳ 2'
                  },
                  {
                    value: '3',
                    label: 'Học kỳ hè'
                  }
                ]}
              />
            </div>
            <div className="ops">
              <Text>Mã sinh viên: </Text>
              <Input
                className="customInp"
                readOnly
              />
            </div>
            <div className="ops">
              <Text>Họ tên sinh viên: </Text>
              <Input
                className="customInp"
                readOnly
              />
            </div>
            <RadioPaid/>
            <PaymentTable/>
          </div>
        </div>
        
      </div>
    </div>
  );
}