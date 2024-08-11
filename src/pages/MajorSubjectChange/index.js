import React, { useState, useEffect } from "react";
import "./CourseChange.css";
import Header from "../../components/courseHeader";
import { Table, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../../components/ContentLayout";
import { getMajorSubjects } from "../../data/coursesData";

export default function MajorSubjectChange() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const majorSubjects = await getMajorSubjects();
        if (!majorSubjects) {
          throw new Error("Failed to fetch major subjects");
        }
        const allCourses = Object.entries(majorSubjects).map(([id, course]) => ({
          id,
          ...course,
        }));
        setCourses(allCourses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Chuyên ngành",
      dataIndex: "major",
      key: "major",
      filters: Array.from(new Set(courses.map((course) => course.major))).map(
        (major) => ({
          text: major,
          value: major,
        })
      ),
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

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="courseChange-container flex">
      <Header />
      <div className="text-3xl my-4 grow flex flex-col">
        <h1 className="flex justify-center items-center my-4 text-black font-semibold">
          Quản lý học vụ
        </h1>
        <div>
          <ContentLayout onCreate={() => navigate("/createSubject")}>
            <Table
              dataSource={courses}
              columns={columns}
              tableLayout="auto"
            />
          </ContentLayout>
        </div>
      </div>
    </div>
  );
}
