import Header from '../../components/Header';
import './Home.css';
import React from 'react';

export default function Home(){
    return (
        <div className='home-container'>
            <Header/>
            <div className='home'>
                <h1 className="message">Home Pa Ge</h1>
            </div>
        </div>
    );
}