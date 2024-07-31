import React from 'react';
import './NoPage.css';
import Header from '../../components/Header';
import CourseHeader from '../../components/courseHeader';

const NoPage = ({ role }) => {
    let HeaderComponent;

    switch (role) {
        case '1':
            HeaderComponent = Header;
            break;
        case '2':
            HeaderComponent = CourseHeader;
            break;
        case '3':
            break;
        default:
            HeaderComponent = Header;
    }

    return (
        <div className="no-page-container">
            <HeaderComponent />
            <div className="no-page">
                <h1 className="no-title">Đã xảy ra lỗi!</h1>
                <p className="no-message">Xin vui lòng thử lại sau.</p>
            </div>
        </div>
    );
};

export default NoPage;