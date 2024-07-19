import './App.css';
import Logging from './pages/Logging/Logging';
import Home from './pages/Home/Home';
import NoPage from './pages/NoPage/NoPage';
import Pay from './pages/Pay/Pay';
import History from './pages/History/History';
import Register from './pages/Register/Register';
import Specialized from './pages/Specialized/Specialized';
import Improve from './pages/Improve/Improve';
import Registered from './pages/Registered/Registered';
import Available from './pages/Available/Available';
import Contact from './pages/Contact/Contact';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Logging />} />
          <Route path='/home' element={<Home />} />
          <Route path='/tuition/pay' element={<Pay />} />
          <Route path='/tuition/history' element={<History />} />
          <Route path='/courses/register/general' element={<Register />} />
          <Route path='/courses/register/specialized' element={<Specialized />} />
          <Route path='/courses/register/improve' element={<Improve />} />
          <Route path='/courses/registered' element={<Registered />} />
          <Route path='/courses/available' element={<Available />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
};