import React from "react";
import './CourseChange.css';
import Header from "../../components/courseHeader";


export default function CourseChange() {
  return (
    <div className="courseChange-container">
      <Header />
      <div className="courseChange">
        <h1>Course Change Page</h1>
        <p>This is the page for role 2 users (Phòng Giáo Vụ).</p>
      </div>
    </div>
  );
}