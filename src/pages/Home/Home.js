import Header from '../../components/Header';
import './Home.css';
import React from 'react';

export default function Home() {
    return (
        <div className='home-container'>
            <Header />
            <div className='home'>
                <h1>Home Page</h1>
                <p>This is the page for role 1 users (Sinh Viên).</p>
            </div>
        </div>
    );
}