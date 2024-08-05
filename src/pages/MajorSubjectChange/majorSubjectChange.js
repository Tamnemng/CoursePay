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

const coursesData = [
  {
    id: "0",
    major: "spa",
    semester: "s1n1",
    courses: [
      {
        id: "mon1",
        name: "Môn 1",
        credits: 3,
        semester: 1,
        type: false,
        classes: [
          {
            id: "class1-1",
            name: "Lớp 1",
            class_size: 35,
            lecturers: "Trần Thị B",
            started_day: "02/01/2024",
            ended_day: "02/06/2024",
          },
          {
            id: "class1-2",
            name: "Lớp 2",
            class_size: 30,
            lecturers: "Nguyễn Văn A",
            started_day: "03/01/2024",
            ended_day: "03/06/2024",
          },
          {
            id: "class1-3",
            name: "Lớp 3",
            class_size: 32,
            lecturers: "Lê Thị C",
            started_day: "04/01/2024",
            ended_day: "04/06/2024",
          },
          {
            id: "class1-4",
            name: "Lớp 4",
            class_size: 28,
            lecturers: "Phạm Văn D",
            started_day: "05/01/2024",
            ended_day: "05/06/2024",
          },
          {
            id: "class1-5",
            name: "Lớp 5",
            class_size: 34,
            lecturers: "Ngô Thị E",
            started_day: "06/01/2024",
            ended_day: "06/06/2024",
          },
        ],
      },
      {
        id: "mon2",
        name: "Môn 2",
        credits: 3,
        semester: 1,
        type: false,
        classes: [
          {
            id: "class2-1",
            name: "Lớp 1",
            class_size: 35,
            lecturers: "Trần Thị F",
            started_day: "02/01/2024",
            ended_day: "02/06/2024",
          },
          {
            id: "class2-2",
            name: "Lớp 2",
            class_size: 30,
            lecturers: "Nguyễn Văn G",
            started_day: "03/01/2024",
            ended_day: "03/06/2024",
          },
          {
            id: "class2-3",
            name: "Lớp 3",
            class_size: 32,
            lecturers: "Lê Thị H",
            started_day: "04/01/2024",
            ended_day: "04/06/2024",
          },
          {
            id: "class2-4",
            name: "Lớp 4",
            class_size: 28,
            lecturers: "Phạm Văn I",
            started_day: "05/01/2024",
            ended_day: "05/06/2024",
          },
          {
            id: "class2-5",
            name: "Lớp 5",
            class_size: 34,
            lecturers: "Ngô Thị J",
            started_day: "06/01/2024",
            ended_day: "06/06/2024",
          },
        ],
      },
      {
        id: "mon3",
        name: "Môn 3",
        credits: 3,
        semester: 1,
        type: false,
        classes: [
          {
            id: "class3-1",
            name: "Lớp 1",
            class_size: 35,
            lecturers: "Trần Thị K",
            started_day: "02/01/2024",
            ended_day: "02/06/2024",
          },
          {
            id: "class3-2",
            name: "Lớp 2",
            class_size: 30,
            lecturers: "Nguyễn Văn L",
            started_day: "03/01/2024",
            ended_day: "03/06/2024",
          },
          {
            id: "class3-3",
            name: "Lớp 3",
            class_size: 32,
            lecturers: "Lê Thị M",
            started_day: "04/01/2024",
            ended_day: "04/06/2024",
          },
          {
            id: "class3-4",
            name: "Lớp 4",
            class_size: 28,
            lecturers: "Phạm Văn N",
            started_day: "05/01/2024",
            ended_day: "05/06/2024",
          },
          {
            id: "class3-5",
            name: "Lớp 5",
            class_size: 34,
            lecturers: "Ngô Thị O",
            started_day: "06/01/2024",
            ended_day: "06/06/2024",
          },
        ],
      },
      {
        id: "mon4",
        name: "Môn 4",
        credits: 3,
        semester: 1,
        type: false,
        classes: [
          {
            id: "class4-1",
            name: "Lớp 1",
            class_size: 35,
            lecturers: "Trần Thị P",
            started_day: "02/01/2024",
            ended_day: "02/06/2024",
          },
          {
            id: "class4-2",
            name: "Lớp 2",
            class_size: 30,
            lecturers: "Nguyễn Văn Q",
            started_day: "03/01/2024",
            ended_day: "03/06/2024",
          },
          {
            id: "class4-3",
            name: "Lớp 3",
            class_size: 32,
            lecturers: "Lê Thị R",
            started_day: "04/01/2024",
            ended_day: "04/06/2024",
          },
          {
            id: "class4-4",
            name: "Lớp 4",
            class_size: 28,
            lecturers: "Phạm Văn S",
            started_day: "05/01/2024",
            ended_day: "05/06/2024",
          },
          {
            id: "class4-5",
            name: "Lớp 5",
            class_size: 34,
            lecturers: "Ngô Thị T",
            started_day: "06/01/2024",
            ended_day: "06/06/2024",
          },
        ],
      },
      {
        id: "mon5",
        name: "Môn 5",
        credits: 3,
        semester: 1,
        type: false,
        classes: [
          {
            id: "class5-1",
            name: "Lớp 1",
            class_size: 35,
            lecturers: "Trần Thị U",
            started_day: "02/01/2024",
            ended_day: "02/06/2024",
          },
          {
            id: "class5-2",
            name: "Lớp 2",
            class_size: 30,
            lecturers: "Nguyễn Văn V",
            started_day: "03/01/2024",
            ended_day: "03/06/2024",
          },
          {
            id: "class5-3",
            name: "Lớp 3",
            class_size: 32,
            lecturers: "Lê Thị W",
            started_day: "04/01/2024",
            ended_day: "04/06/2024",
          },
          {
            id: "class5-4",
            name: "Lớp 4",
            class_size: 28,
            lecturers: "Phạm Văn X",
            started_day: "05/01/2024",
            ended_day: "05/06/2024",
          },
          {
            id: "class5-5",
            name: "Lớp 5",
            class_size: 34,
            lecturers: "Ngô Thị Y",
            started_day: "06/01/2024",
            ended_day: "06/06/2024",
          },
        ],
      },
    ],
  },
  {
    id: "1",
    major: "spa",
    semester: "s1n2",
    courses: [],
  },
  {
    id: "3",
    major: "spa",
    semester: "s2n2",
    courses: [],
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
