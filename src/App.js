import './App.css';
import Logging from './pages/Logging/Logging'
import Home from './pages/Home/Home'
import NoPage from './pages/NoPage/NoPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Logging />}/>
          <Route path='/home' element={<Home />}/>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};