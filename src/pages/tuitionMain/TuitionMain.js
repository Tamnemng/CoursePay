import React from "react";
import './TuitionMain.css';
import Header from "../../components/tuitionHeader";


export default function TuitionMain() {
  return (
    <div className="tuitionMain-container">
      <Header />
      <div className="tuitionMain">
        <h1>Tuition Main Page</h1>
        <p>This is the page for role 3 users (Phòng Tài Vụ).</p>
      </div>
    </div>
  );
}