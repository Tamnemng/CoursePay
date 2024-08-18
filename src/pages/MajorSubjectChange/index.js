import React, { useState, useEffect } from "react";
import "./CourseChange.css";
import Header from "../../components/courseHeader";
import { Table, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../../components/ContentLayout";
import { getMajorSubjects } from "../../data/subjects";

export default function MajorSubjectChange() {
  const [majorSubjects, setMajorSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const result = await getMajorSubjects();
      if (result.status === "success") {
        const allSubjects = [];
        const data = result.data;
        for (const faculty in data) {
          for (const major in data[faculty]) {
            for (const semester in data[faculty][major]) {
              const subjects = data[faculty][major][semester];
              for (const type in subjects) {
                const subjectList = subjects[type];
                for (const subjectId in subjectList) {
                  allSubjects.push({
                    id: subjectId,
                    name: subjectList[subjectId].name,
                    credits: subjectList[subjectId].credits,
                    faculty,
                    major,
                    semester,
                    type,
                  });
                }
              }
            }
          }
        }
        setMajorSubjects(allSubjects);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, []);

  const facultyFilters = Array.from(
    new Set(majorSubjects.map((subject) => subject.faculty))
  ).map((faculty) => ({ text: faculty, value: faculty }));

  // const semesterFilters = Array.from(
  //   new Set(majorSubjects.map((subject) => subject.semester))
  // ).map((semester) => ({ text: semester, value: semester }));

  const semesterFilters = [
    {
      value: "HK1",
      text: "HK1",
    },
    {
      value: "HK2",
      text: "HK2",
    },
    {
      value: "HK3",
      text: "HK3",
    },
    {
      value: "HK4",
      text: "HK4",
    },
    {
      value: "HK5",
      text: "HK5",
    },
    {
      value: "HK6",
      text: "HK6",
    },
    {
      value: "HK7",
      text: "HK7",
    },
    {
      value: "HK8",
      text: "HK8",
    },
  ];

  const columns = [
    {
      title: "Khoa",
      dataIndex: "faculty",
      key: "faculty",
      filters: facultyFilters,
      onFilter: (value, record) => record.faculty === value,
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      filters: semesterFilters,
      onFilter: (value, record) => record.semester === value,
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
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: "Loại môn học",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        return type === "elective" ? "Tự chọn" : "Bắt buộc";
      },
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
        <h1 className="flex justify-center items-center my-4 font-semibold text-blue-500">
          Học Phần Chuyên Ngành
        </h1>
        <div>
          <ContentLayout
            onCreate={() => navigate("/majorSubjectChange/create")}
          >
            {loading ? (
              <div className="flex h-full w-full justify-center items-center">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
              </div>
            ) : (
              <Table
                dataSource={majorSubjects}
                columns={columns}
                tableLayout="auto"
                rowKey="id"
              />
            )}
          </ContentLayout>
        </div>
      </div>
    </div>
  );
}
