import React from "react";
import "./CourseChange.css";
import Header from "../../components/courseHeader";
import { Table, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ContentLayout from "../../components/ContentLayout";
import { render } from "@testing-library/react";

const majorSubject = [
  {
    id: "a001",
    name: "JavaScript Basics",
    credits: 3,
    semester: 3,
    type: "Tự chọn",
    major: "Công nghệ thông tin",
    classSections: [
      {
        id: "a001013",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "a001023",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "a001033",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "a003",
    name: "Python Basics",
    credits: 3,
    semester: 3,
    type: "Bắc buộc",
    major: "Công nghệ thông tin",
    classSections: [
      {
        id: "a003013",
        teacher: "Gv. Le thi A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 40,
      },
      {
        id: "a003023",
        teacher: "Gv. Bui thi B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 40,
      },
      {
        id: "a003033",
        teacher: "Gv. Nguyen Duc C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 40,
      },
    ],
  },
  {
    id: "a005",
    name: "C++ Basics",
    credits: 3,
    semester: 2,
    type: "Tự chọn",
    major: "Công nghệ thông tin",
    classSections: [
      {
        id: "a005012",
        teacher: "Gv. Nguyen Van H",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "a005022",
        teacher: "Gv. Nguyen Le K",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "b001",
    name: "Nhập môn sư phạm",
    credits: 2,
    semester: 1,
    type: "Bắc buộc",
    major: "Sư phạm Anh",
    classSections: [
      {
        id: "b001011",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "b001012",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "b001013",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "b004",
    name: "Kỹ năng thuyết trình",
    credits: 2,
    semester: 2,
    type: "Bắc buộc",
    major: "Sư phạm Anh",
    classSections: [
      {
        id: "b004012",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "b004022",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "b004032",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "c001",
    name: "Nhập môn lập trình",
    credits: 2,
    semester: 1,
    type: "Bắc buộc",
    major: "Sư phạm Tin",
    classSections: [
      {
        id: "c001011",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c001012",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c001013",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "c009",
    name: "Quy hoạch tuyến tính và ứng dụng",
    credits: 2,
    semester: 4,
    type: "Bắc buộc",
    major: "Sư phạm Tin",
    classSections: [
      {
        id: "c009014",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c009024",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c009034",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
  {
    id: "c007",
    name: "Lắp ráp và cài đặt máy tính",
    credits: 3,
    semester: 4,
    type: "Tự chọn",
    major: "Sư phạm Tin",
    classSections: [
      {
        id: "c007014",
        teacher: "Gv. Nguyen Van A",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c007024",
        teacher: "Gv. Nguyen Van B",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
      {
        id: "c007034",
        teacher: "Gv. Nguyen Van C",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        enrolled: 50,
      },
    ],
  },
];

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
    // {
    //   title: "Danh sách lớp học phần",
    //   dataIndex: "classSections",
    //   key: "classSections",
    //   render: (classSections) => (
    //     <ul>
    //       {classSections.map((section) => (
    //         <li key={section.id}>
    //           {section.teacher} - {section.enrolled} đăng ký
    //         </li>
    //       ))}
    //     </ul>
    //   ),
    // },
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
          <ContentLayout onCreate={() => navigate("/majorSubjectChange/create")}>
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
