import React from "react";
import './TuitionEdit.css';
import Header from "../../components/tuitionHeader";
import Typography from "antd/es/typography/Typography";
import { Select, Input, Button, DatePicker } from "antd";
import FeesDifList from "./FeesDifList";

const {Title, Text} = Typography;
const {RangePicker} = DatePicker;
const disabled1Year = (current, { from }) => {
  if (from) {
    const yearsDifference = Math.abs(from.year() - current.year());
    return yearsDifference >= 2;
  }
  return false;
};

export default function TuitionEdit() {
  return (
    <div className="tuitionEdit-container">
      <Header />
      <div className="tuitionEdit">
      <div className="tl">
          <Title level={3}>Học phí khác</Title>
        </div>
        <div className="frm">
          <Title level={4}>Chi tiết học phí</Title>
          <div className="ops">
            <Text>Mã phí: </Text>
            <Input
              style={{
                width: '30%',
                height: '30px',
                marginRight: '150px',
                marginLeft: '10px',
              }}
              placeholder="Mã phí"
              readOnly
            />
            <Text>Năm học:</Text>
            <RangePicker 
              picker="year"
              style={{
                marginLeft: '10px',
              }}
              disabledDate={disabled1Year}
            />
          </div>
          <div className="ops">
          <Text>Tên học phí:</Text>
              <Input
                style={{
                  width: '30%',
                  height: '30px',
                  marginRight: '150px',
                  marginLeft: '10px',
                }}
                placeholder="Tên học phí"
              />
              <Text>Học kỳ: </Text>
              <Select
                style={{
                  width: '200px',
                  marginLeft: '10px',
                }}
                defaultValue={'null'}
                options={[
                  {
                    value: 'hk1',
                    label: 'Học kỳ 1',
                  },
                  {
                    value: 'hk2',
                    label: 'Học kỳ 2',
                  },
                  {
                    value: 'hk3',
                    label: 'Học kỳ hè',
                  },
                  {
                    value: 'null',
                    label: 'Trống',
                  },
                ]}
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
                placeholder="4 000 000"
                addonAfter="VNĐ"
              />
              <Text>Ngày hết hạn: </Text>
              <DatePicker format={'DD-MM-YYYY'} style={{marginLeft: '10px'}}/>
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
          <div className="feesList">
            <FeesDifList/>
          </div>
        </div>
      </div>
    </div>
  );
}