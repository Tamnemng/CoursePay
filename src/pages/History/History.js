import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import Header from "../../components/Header";
import { Table, message } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import "./History.css";
import { getStudentPaid, getStudentInfo } from "../../data/studentData";
import Nav from "../../components/Nav";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArialUnicodeMS from "../../data/Roboto-Regular.ttf";

export default function History() {
  const [paidFees, setPaidFees] = useState([]);
  const [info, setInfo] = useState({});
  const [selectedFee, setSelectedFee] = useState(null);
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
      const res = await getStudentInfo();
      setInfo(res);
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

  const handleExportPDF = (fee) => {
    const doc = new jsPDF();
    doc.addFont(ArialUnicodeMS, "ArialUnicodeMS", "normal");
    doc.setFont("ArialUnicodeMS");
    doc.setFontSize(18);
    doc.text("Hóa Đơn", 20, 20);
    doc.setFontSize(12);
    doc.text(`Mã số sinh viên: ${info.id || ""}`, 20, 30);
    doc.text(`Họ và tên: ${info.name || ""}`, 20, 40);
    doc.text(`Học kỳ: ${info.semester || ""}`, 20, 60);

    doc.text(`Mã hóa đơn: ${fee.id || ""}`, 20, 70);
    doc.text(`Tên Phí: ${fee.name || ""}`, 20, 80);
    doc.text(
      `Khoản tiền thanh toán: ${parseInt(fee.amount).toLocaleString(
        "vi-VN"
      )} VNĐ`,
      20,
      90
    );
    doc.text(
      `Ngày thanh toán: ${moment(fee.paymentDate).format("DD/MM/YYYY")}`,
      20,
      100
    );
    doc.save("phieu_hoa_don.pdf");
  };

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
        return date.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      title: "Xuất Hóa Đơn",
      render: (_, record) => (
        <a className="text-blue-500" onClick={() => handleExportPDF(record)}>
          <CloudDownloadOutlined /> Tải xuống
        </a>
      ),
      className: "action-column",
    },
  ];

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
              onRow={(record) => ({
                onClick: () => setSelectedFee(record),
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
