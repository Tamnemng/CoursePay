import React from "react";
import './TuitionEdit.css';
import Header from "../../components/tuitionHeader";


export default function TuitionEdit() {
  return (
    <div className="tuitionEdit-container">
      <Header />
      <div className="tuitionEdit">
        <h1>Tuition Edit Page</h1>
        <p>This is the page for role 3 users (Phòng Tài Vụ).</p>
      </div>
    </div>
  );
}