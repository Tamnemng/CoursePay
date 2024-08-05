import React from "react";
import "./CourseChange.css";
import Header from "../../components/courseHeader";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../../components/ContentLayout";
import { render } from "@testing-library/react";
import { majorSubject } from "../../data/coursesData";

export default function MajorSubjectChange() {
  const navigate = useNavigate();

  // lay danh sach chuyen nganh tu majorSubject
  const majors = [...new Set(majorSubject.map((course) => course.major))];

  const columns = [
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
      filters: majors.map((major) => ({
        text: major,
        value: major,
      })),
      onFilter: (value, record) => record.major === value,
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      sorter: (a, b) => a.semester - b.semester,
    },
    {
      title: "Mã học phần",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên học phần",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Loại môn học",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <Button
          onClick={() => {
            navigate(`/majorSubjectChange/${text}`);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="courseChange-container flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Quản lý học vụ
        </h1>
        <div>
          <ContentLayout
            onCreate={() => navigate("/majorSubjectChange/create")}
          >
            <Table
              dataSource={majorSubject}
              columns={columns}
              tableLayout="auto"
            />
          </ContentLayout>
        </div>
      </div>
    </div>
  );
}
