import React from "react";
import './TuitionMajor.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Input, Button } from "antd";
import FeesList from "./FeesList";

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
          <div className="ops">
              <Text>Mã phí: </Text>
              <Input
                //className="customInp"
                style={{
                  width: '30%',
                  height: '30px',
                  marginRight: '150px',
                  marginLeft: '10px',
                }}
                placeholder="Mã phí"
                readOnly
              />
              <Text>Tên phí:</Text>
              <Input
                style={{
                  width: '30%',
                  height: '30px',
                  marginLeft: '10px',
                }}
                placeholder="Tên phí"
              />
          </div>
          <div className="ops">
              <Text>Thành tiền: </Text>
              <Input
                //className="customInp"
                style={{
                  width: '30%',
                  height: '30px',
                  marginRight: '150px',
                  marginLeft: '10px',
                }}
                placeholder="4 000 000 VND"
              />
              <Text>Ngày hết hạn:</Text>
              <Input
                style={{
                  width: '30%',
                  height: '30px',
                  marginLeft: '10px',
                }}
                placeholder="2024-01-01"
              />
          </div>
          <div className="btn">
            <Button 
              type="primary" 
              style={{
                marginRight: '10px',
              }}
            >
              Thêm
            </Button>
            <Button 
              type="primary" 
              ghost
              style={{
                marginRight: '10px',
              }}
            >
              Sửa
            </Button>
            <Button type="dashed" danger>Xóa</Button>
          </div>
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
          <div className="feesList">
            <FeesList/>
          </div>
        </div>
      </div>
    </div>
  );
}