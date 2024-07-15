import React from 'react';
import Header from '../../components/Header';
import './Contact.css';

export default function Contact() {
    return (
        <div className='contact-container'>
            <Header />
            <div className='contact'>
                <h1 className='Title'>
                    Liên Hệ
                </h1>
                <h1 className='message'>
                    Nguyễn Đức A
                </h1>
                <h1 className='message'>
                    09123456789
                </h1>
                <h1 className='message'>
                    NguyenDucA@gmail.com
                </h1>
                <h1 className='message'>
                    facebook.com
                </h1>
            </div>
        </div>
    )
};