import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  message,
  Typography,
  Checkbox,
  Space,
  Tag,
  Spin,
} from "antd";
import Header from "../../components/Header";
import {
  getStudentPaid,
  getStudentInfo,
  updatePaymentStatus,
} from "../../data/studentData";
import "./Pay.css";
import Nav from "../../components/Nav";

const { Text, Title } = Typography;

const Pay = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [unpaidFees, setUnpaidFees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fees, studentInfo] = await Promise.all([
        getStudentPaid(),
        getStudentInfo(),
      ]);

      const processedFees = Object.entries(fees)
        .filter(([_, fee]) => !fee.paid)
        .map(([id, fee]) => ({ ...fee, id }));

      setUnpaidFees(processedFees);
      setStudentData(studentInfo);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeeSelection = (checkedValues) => {
    setSelectedFees(checkedValues);
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await Promise.all(
        selectedFees.map((feeId) => updatePaymentStatus(feeId))
      );
      message.success("Thanh toán học phí thành công!");
      // Cập nhật danh sách học phí chưa đóng
      setUnpaidFees((prevFees) =>
        prevFees.filter((fee) => !selectedFees.includes(fee.id))
      );
      setSelectedFees([]);
    } catch (error) {
      message.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && unpaidFees.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen w-full ">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pay-container !flex !flex-col">
      <Nav />
      <div className="flex">
        <Header />
        <div className="pay">
          <div className="theupper">
            <StudentInfo studentData={studentData} loading={loading} />
            <PaymentSection
              form={form}
              loading={loading}
              onFinish={onFinish}
              isDisabled={selectedFees.length === 0}
            />
          </div>
          <FeeSelection
            unpaidFees={unpaidFees}
            selectedFees={selectedFees}
            handleFeeSelection={handleFeeSelection}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const StudentInfo = ({ studentData }) => (
  <div className="student-informations">
    <Title level={2}>Thông Tin Sinh Viên</Title>
    <Text>
      <pre>ID: {studentData.id}</pre>
      <pre>Họ và tên: {studentData.name}</pre>
      <pre>Ngành học: {studentData.major}</pre>
    </Text>
    <div className="warning">
      Yêu cầu sinh viên kiểm tra thông tin thật kỹ trước khi đóng tiền học.
    </div>
  </div>
);

const PaymentSection = ({ form, loading, onFinish, isDisabled }) => (
  <div className="pay-informations">
    <Title level={2}>Thanh Toán</Title>
    <Form
      form={form}
      name="tuition_payment"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          disabled={isDisabled}
        >
          Xác nhận thanh toán
        </Button>
      </Form.Item>
    </Form>
  </div>
);

const FeeSelection = ({ unpaidFees, selectedFees, handleFeeSelection }) => (
  <div className="fee-selection">
    <Title level={3}>Chọn khoản phí cần thanh toán</Title>
    {unpaidFees.length > 0 ? (
      <Checkbox.Group onChange={handleFeeSelection} value={selectedFees}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {unpaidFees.map((fee) => (
            <Checkbox key={fee.id} value={fee.id}>
              <Space>
                {fee.name} - {parseInt(fee.amount).toLocaleString("vi-VN")} VNĐ
                <Tag color="red">Chưa đóng</Tag>
              </Space>
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
    ) : (
      <Text>Không có khoản phí nào cần thanh toán.</Text>
    )}
  </div>
);

export default Pay;
