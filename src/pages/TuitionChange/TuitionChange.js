import React from "react";
import './TuitionChange.css';
import Header from "../../components/tuitionHeader";


export default function TuitionChange() {
  return (
    <div className="tuitionChange-container">
      <Header />
      <div className="tuitionChange">
        <h1>Tuition Change Page</h1>
        <p>This is the page for role 3 users (Phòng Tài Vụ).</p>
      </div>
    </div>
  );
}