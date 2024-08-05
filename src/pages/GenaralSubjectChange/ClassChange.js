import React from "react";
import './ClassChange.css';
import Header from "../../components/courseHeader";


export default function GeneralSubjectChange() {
  return (
    <div className="classChange-container">
      <Header />
      <div className="classChange">
        <h1>Class Change Page</h1>
        <p>This is the page for role 2 users (Phòng Giáo Vụ).</p>
      </div>
    </div>
  );
}