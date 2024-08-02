import React from "react";
import './CourseEdit.css';
import Header from "../../components/courseHeader";


export default function CourseEdit() {
  return (
    <div className="courseEdit-container">
      <Header />
      <div className="courseEdit">
        <h1>Course Edit Page</h1>
        <p>This is the page for role 2 users (Phòng Giáo Vụ).</p>
      </div>
    </div>
  );
}