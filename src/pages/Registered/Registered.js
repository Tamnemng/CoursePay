import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import { Button, Table } from "antd";
import moment from "moment";
import jsPDF from "jspdf";
import "./Registered.css";
import { getStudentCourses } from "../../data/studentData";
import { deleteRegisteredCourse, getStudentInfo } from "../../data/studentData";
import { decreaseEnrolled } from "../../data/subjects";
import Nav from "../../components/Nav";
import "jspdf-autotable";

import ArialUnicodeMS from '../../data/Roboto-Regular.ttf';

export default function Registered() {
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const coursesData = await getStudentCourses();
      if (coursesData) {
        const processedCourses = Object.entries(coursesData).map(
          ([id, course]) => ({
            key: id,
            ...course,
          })
        );
        setCourses(processedCourses);
      } else {
        setCourses([]);
      }
      const res = await getStudentInfo();
      setInfo(res);
    } catch (err) {
      console.error("Error fetching data:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = async (record) => {
    try {
      await deleteRegisteredCourse(record.key);
      await decreaseEnrolled(record.key);
      fetchData();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.addFont(ArialUnicodeMS, "ArialUnicodeMS", "normal");
    
    doc.setFont("ArialUnicodeMS");
    doc.setFontSize(18);

    doc.text("Phiếu Đăng Ký Môn Học", 20, 20);

    doc.setFontSize(12);
    doc.text(`Mã số sinh viên: ` + info.id, 20, 30);
    doc.text(`Họ và tên: ` + info.name, 20, 40);
    doc.text(`Ngày đăng ký: ${moment().format("DD/MM/YYYY")}`, 20, 50);
    doc.text(`Học kỳ: ` + info.semester, 20, 60);

    doc.autoTable({
      startY: 70,
      head: [["STT", "Mã môn học", "Tên môn học", "Số tín chỉ"]],
      body: courses.map((course, index) => [
        index + 1,
        course.key,
        course.name,
        course.credits,
      ]),
      styles: { font: "ArialUnicodeMS"},
      headStyles: { fontStyle: "bold", fillColor: [200, 200, 200], textColor: 20 },
    });

    doc.save("phieu_dang_ky_mon_hoc.pdf");
  };
  
  const columns = [
    {
      title: "Tên Môn Học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tín Chỉ",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Giảng viên",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Lịch học",
      dataIndex: "timetable",
      key: "timetable",
    },
    {
      title: "Xóa Môn Học",
      render: (_, record) => (
        <a onClick={() => handleDeleteClick(record)} className="delete">
          Xoá Môn Học
        </a>
      ),
      className: "action-column",
    },
  ];

  return (
    <div className="registered-container !flex !flex-col">
      <Nav />
      <div className="flex">
        <Header />
        <div className="registered">
          <h1>Các Học Phần Đã Đăng Ký</h1>
          <div className="table-container">
            <Table
              className="displayer"
              dataSource={courses}
              columns={columns}
              rowKey="key"
              loading={loading}
            />
          </div>
          <div className="flex justify-end mx-10">
            <Button className="w-fit" type="primary" onClick={handleExportPDF}>
              Xuất phiếu đăng ký
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}