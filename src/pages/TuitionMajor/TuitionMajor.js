import React, { useState, useEffect } from "react";
import "./TuitionMajor.css";
import Header from "../../components/tuitionHeader";
import {
  Typography,
  Select,
  Input,
  Button,
  Table,
  message,
  Popconfirm,
  Tabs,
} from "antd";
import {
  getFees,
  addFeeToStudents,
  removeFeeFromAllStudents,
  editFeeForStudents,
  addCreditBasedFeeToStudents,
} from "../../data/TuitionData";
import Nav from "../../components/Nav";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const isCreditBased = (feeId) => {
  return feeId.startsWith("feee_");
};

const extractCredits = (feeName) => {
  const match = feeName.match(/\[(\d+)\]/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null; // Không thể trích xuất số tín chỉ
};

export default function TuitionMajor() {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [semester, setSemester] = useState("");
  const [amount, setAmount] = useState("");
  const [creditCost, setCreditCost] = useState("");

  useEffect(() => {
    getFees(setFees);
  }, []);

  const handleAddFee = () => {
    if (!selectedFee || !amount) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const newFee = {
      name: selectedFee,
      amount: amount,
    };
    addFeeToStudents(newFee, semester)
      .then((count) => {
        message.success(`Đã thêm học phí thành công cho ${count} sinh viên`);
        getFees(setFees);
        setSelectedFee(null);
        setAmount("");
        setSemester("");
      })
      .catch((error) => {
        console.error("Lỗi khi thêm học phí:", error);
        message.error("Không thể thêm học phí");
      });
  };

  const handleAddCreditBasedFee = () => {
    if (!creditCost) {
      message.error("Vui lòng nhập giá mỗi tín chỉ");
      return;
    }
    addCreditBasedFeeToStudents(parseFloat(creditCost))
      .then((count) => {
        message.success(
          `Đã thêm học phí tín chỉ thành công cho ${count} sinh viên`
        );
        getFees(setFees);
        setCreditCost("");
      })
      .catch((error) => {
        console.error("Lỗi khi thêm học phí tín chỉ:", error);
        message.error("Không thể thêm học phí tín chỉ");
      });
  };

  const handleDeleteFee = (feeId) => {
    removeFeeFromAllStudents(feeId)
      .then((count) => {
        message.success(`Đã xóa học phí thành công cho ${count} sinh viên`);
        getFees(setFees);
      })
      .catch((error) => {
        console.error("Lỗi khi xóa học phí:", error);
        message.error("Không thể xóa học phí");
      });
  };

  const handleEditFee = (feeId, updatedFee) => {
    let newFee = updatedFee;
    if (isCreditBased(feeId)) {
      const totalCredits = extractCredits(updatedFee.name);
      if (totalCredits === null) {
        message.error(
          "Tên học phí tín chỉ không hợp lệ. Không thể trích xuất số tín chỉ."
        );
        return;
      }
      const newCreditCost = parseFloat(updatedFee.amount);
      newFee = {
        ...updatedFee,
        amount: (totalCredits * newCreditCost).toFixed(2),
      };
    }
    editFeeForStudents(feeId, newFee)
      .then((count) => {
        message.success(
          `Đã cập nhật học phí thành công cho ${count} sinh viên`
        );
        getFees(setFees);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật học phí:", error);
        message.error("Không thể cập nhật học phí");
      });
  };

  const columns = [
    {
      title: "Mã Học Phí",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên học phí",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Input
          defaultValue={text}
          disabled={isCreditBased(record.id)}
          onBlur={(e) => handleEditFee(record.id, { name: e.target.value })}
        />
      ),
    },
    {
      title: "Số Tiền",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => {
        if (isCreditBased(record.id)) {
          const totalCredits = extractCredits(record.name);
          if (totalCredits === null) {
            return <Text>Học Phí Tín Chỉ</Text>;
          }
          const creditCost = parseFloat(record.amount) / totalCredits;
          return (
            <Input
              defaultValue={creditCost.toFixed(2)}
              addonAfter="VNĐ/Tín Chỉ"
              onBlur={(e) =>
                handleEditFee(record.id, {
                  amount: e.target.value,
                  name: record.name,
                })
              }
            />
          );
        } else {
          return (
            <Input
              defaultValue={text}
              addonAfter="VNĐ"
              onBlur={(e) =>
                handleEditFee(record.id, { amount: e.target.value })
              }
            />
          );
        }
      },
    },
    {
      title: "Số Lượng Đã Nộp",
      dataIndex: "paidCount",
      key: "paidCount",
    },
    {
      title: "Số Lượng Chưa Nộp",
      dataIndex: "unpaidCount",
      key: "unpaidCount",
    },
    {
      title: "Thao Tác",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa học phí này?"
          onConfirm={() => handleDeleteFee(record.id)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="dashed" danger>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Thêm Học Phí Cố Định",
      children: (
        <div className="frm">
          <Title level={4}>Chi Tiết Học Phí</Title>
          <div className="ops">
            <Text>Tên Học Phí: </Text>
            <Input
              style={{
                width: "30%",
                marginRight: "150px",
                marginLeft: "10px",
              }}
              placeholder="Nhập tên học phí"
              onChange={(e) => setSelectedFee(e.target.value)}
            />
          </div>
          <div className="ops">
            <Text>Số Tiền: </Text>
            <Input
              style={{
                width: "30%",
                marginRight: "150px",
                marginLeft: "10px",
              }}
              placeholder="Nhập số tiền cần đóng"
              addonAfter="VNĐ"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Text>Học Kỳ: </Text>
            <Select
              style={{ width: "200px", marginLeft: "10px" }}
              value={semester}
              onChange={(value) => setSemester(value)}
            >
              <Select.Option value="">Tất Cả</Select.Option>
              <Select.Option value="HK1">HK1</Select.Option>
              <Select.Option value="HK2">HK2</Select.Option>
              <Select.Option value="HK3">HK3</Select.Option>
            </Select>
          </div>
          <Button type="primary" onClick={handleAddFee}>
            Thêm Học Phí Cố Định
          </Button>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thêm Học Phí Tín Chỉ",
      children: (
        <div className="frm">
          <Title level={4}>Chi Tiết Học Phí Tín Chỉ</Title>
          <div className="ops">
            <Text>Giá Mỗi Tín Chỉ: </Text>
            <Input
              style={{
                width: "30%",
                marginRight: "150px",
                marginLeft: "10px",
              }}
              placeholder="Nhập giá mỗi tín chỉ"
              addonAfter="VNĐ"
              value={creditCost}
              onChange={(e) => setCreditCost(e.target.value)}
            />
          </div>
          <Button type="primary" onClick={handleAddCreditBasedFee}>
            Thêm Học Phí Tín Chỉ
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="tuitionMajor-container flex !flex-col">
      <Nav />
      <div className="flex">
        <div>
          <Header />
        </div>
        <div className="tuitionMajor">
          <div className="tl">
            <Title level={3}>Học Phí Học Kỳ</Title>
          </div>
          <div className="w-full">
            <Tabs defaultActiveKey="1" items={items}></Tabs>
          </div>
          <div className="tl">
            <Title level={3}>Danh Sách Học Phí</Title>
          </div>
          <div className="tbl">
            <Table rowKey="id" dataSource={fees} columns={columns} />
          </div>
        </div>
      </div>
    </div>
  );
}
