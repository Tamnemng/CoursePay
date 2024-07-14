import React from 'react';
import './NoPage.css';
import Header from '../../components/Header';

const NoPage = () => {
    return (
        <div className="no-page-container">
            <Header />
            <div className="no-page">
                <h1 className="no-title">Đã xảy ra lỗi!</h1>
                <p className="no-message">Xin vui lòng thử lại sau.</p>
            </div>
        </div>
    );
};

export default NoPage;
