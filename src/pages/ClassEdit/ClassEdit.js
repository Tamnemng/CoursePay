import React from "react";
import './ClassEdit.css';
import Header from "../../components/courseHeader";


export default function ClassEdit() {
  return (
    <div className="classEdit-container">
      <Header />
      <div className="classEdit">
        <h1>Class Edit Page</h1>
        <p>This is the page for role 2 users (Phòng Giáo Vụ).</p>
      </div>
    </div>
  );
}