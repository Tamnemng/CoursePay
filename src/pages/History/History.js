import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import { Table, message } from "antd";
import "./History.css";
import { getStudentPaid } from "../../data/studentData";
import Nav from "../../components/Nav";


const columns = [
  {
    title: "Mã Hóa Đơn",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên Phí",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Số Tiền",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => `${parseInt(amount).toLocaleString("vi-VN")} VNĐ`,
  },
  {
    title: "Ngày Thanh Toán",
    dataIndex: "paymentDate",
    key: "paymentDate",
    render: (paymentDate) => {
      const date = new Date(paymentDate);
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    },
  },
];

export default function History() {
  const [paidFees, setPaidFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fees = await getStudentPaid();
      if (!fees) {
        throw new Error("Không thể tải dữ liệu học phí");
      }
      const processedFees = Object.entries(fees)
        .filter(([_, fee]) => fee.paid === true)
        .map(([id, fee]) => ({
          ...fee,
          id,
        }));
      setPaidFees(processedFees);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      message.error("Không thể tải lịch sử đóng tiền. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="history-container !flex !flex-col">
      <Nav />
      <div className="!flex">
        <Header />
        <div className="history">
          <h1>Lịch Sử Đóng Tiền</h1>
          <div className="table-container">
            <Table
              className="displayer"
              dataSource={paidFees}
              columns={columns}
              rowKey="id"
              loading={loading}
              locale={{
                emptyText: "Không có dữ liệu",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
